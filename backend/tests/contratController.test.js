const contratController = require('../controllers/contrat.Controller');
const Contrat = require('../models/Contrat.model');
const Avocat = require('../models/Avocat.model');
const Demandeur = require('../models/Demandeur.model');
const User = require('../models/User.model');
const Affaire = require('../models/Affaire.model');
const generateContractPdf = require('../utils/generateContractPdf');

jest.mock('../models/Contrat.model');
jest.mock('../models/Avocat.model');
jest.mock('../models/Demandeur.model');
jest.mock('../models/User.model');
jest.mock('../models/Affaire.model');
jest.mock('../utils/generateContractPdf');

describe('contratController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createContrat', () => {
    test('devrait retourner 400 si champs requis manquants', async () => {
      req.body = {};
      await contratController.createContrat(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Champs requis manquants.' });
    });

    test('devrait retourner 404 si utilisateur avocat introuvable', async () => {
      req.body = {
        avocatNom: 'Jean',
        avocatPrenom: 'Dupont',
        demandeurNom: 'Paul',
        demandeurPrenom: 'Durand',
        numeroAffaire: 'AFF001'
      };
      User.findOne.mockResolvedValueOnce(null);
      await contratController.createContrat(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('devrait créer un contrat avec succès', async () => {
      req.body = {
        avocatNom: 'Jean',
        avocatPrenom: 'Dupont',
        demandeurNom: 'Paul',
        demandeurPrenom: 'Durand',
        numeroAffaire: 'AFF001',
        etat: 'accepté'
      };

      const fakeUser = { _id: 'userId' };
      const fakeAvocat = { _id: 'avocatId', contrats: [], save: jest.fn() };
      const fakeDemandeur = { _id: 'demandeurId' };
      const fakeAffaire = [{ _id: 'affaireId' }];
      const fakeContrat = {
        _id: 'contratId',
        save: jest.fn(),
        fichier: null
      };

      User.findOne.mockResolvedValue(fakeUser);
      Avocat.findOne.mockResolvedValue(fakeAvocat);
      Demandeur.findOne.mockResolvedValue(fakeDemandeur);
      Affaire.find.mockResolvedValue(fakeAffaire);
      Contrat.mockImplementation(() => fakeContrat);
      generateContractPdf.mockResolvedValue();

      await contratController.createContrat(req, res);

      expect(fakeContrat.save).toHaveBeenCalled();
      expect(generateContractPdf).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getPdfContratsByAvocat', () => {
    test('retourne 404 si avocat introuvable', async () => {
      req.user.userId = 'userId';
      Avocat.findOne.mockResolvedValue(null);
      await contratController.getPdfContratsByAvocat(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('retourne liste de pdfs si avocat et contrats trouvés', async () => {
      req.user.userId = 'userId';
      Avocat.findOne.mockResolvedValue({ _id: 'avocatId' });
      Contrat.find.mockResolvedValue([
        { _id: '1', fichier: 'file1.pdf' },
        { _id: '2', fichier: 'file2.pdf' }
      ]);
      await contratController.getPdfContratsByAvocat(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { _id: '1', url: 'http://localhost:7501/pdfs/file1.pdf' },
        { _id: '2', url: 'http://localhost:7501/pdfs/file2.pdf' }
      ]);
    });
  });

  describe('accepterContrat', () => {
    test('retourne 404 si contrat non trouvé', async () => {
      req.params.id = 'contratId';
      Contrat.findByIdAndUpdate.mockResolvedValue(null);
      await contratController.accepterContrat(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('retourne 200 si contrat accepté', async () => {
      req.params.id = 'contratId';
      Contrat.findByIdAndUpdate.mockResolvedValue({ _id: 'contratId', etat: 'accepté' });
      await contratController.accepterContrat(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Contrat accepté avec succès' }));
    });
  });

  describe('refuserContrat', () => {
    test('retourne 404 si contrat non trouvé', async () => {
      req.params.id = 'contratId';
      Contrat.findByIdAndUpdate.mockResolvedValue(null);
      await contratController.refuserContrat(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('retourne 200 si contrat refusé', async () => {
      req.params.id = 'contratId';
      Contrat.findByIdAndUpdate.mockResolvedValue({ _id: 'contratId', etat: 'refusé' });
      await contratController.refuserContrat(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Contrat refusé avec succès' }));
    });
  });

  describe('countContratsBtEtat', () => {
    test('retourne les comptes acceptés et refusés', async () => {
      Contrat.aggregate.mockResolvedValue([
        { _id: 'accepté', count: 5 },
        { _id: 'refusé', count: 2 }
      ]);
      await contratController.countContratsBtEtat(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accepté: 5, refusé: 2 });
    });
  });
});
