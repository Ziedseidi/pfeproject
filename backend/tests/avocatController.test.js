const avocatController = require('../controllers/avocat.Controller');
const Avocat = require('../models/Avocat.model');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

jest.mock('../models/Avocat.model');
jest.mock('../models/User.model');
jest.mock('bcryptjs');

describe('avocatController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, file: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('registerAvocat', () => {
    test("doit retourner 400 si l'utilisateur existe déjà", async () => {
      req.body.email = 'test@example.com';

      User.findOne.mockResolvedValue({ _id: 'existantUserId' }); // Simule user existant

      await avocatController.registerAvocat(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "L'utilisateur existe déjà." });
    });

    test("doit créer un nouvel avocat avec image de profil", async () => {
      req.body = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        password: 'password123',
        phone: '12345678',
        adresse: '123 Rue Paris',
        honoraires: 500,
        region: 'Ile-de-France',
        degreJuridiction: 'Appel',
      };
      req.file = { filename: 'avatar.png' };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');

      // Mock constructeur User et méthode save
      const saveUserMock = jest.fn().mockResolvedValue();
      User.mockImplementation(() => ({
        save: saveUserMock,
      }));

      // Mock constructeur Avocat et méthode save
      const saveAvocatMock = jest.fn().mockResolvedValue();
      Avocat.mockImplementation(() => ({
        save: saveAvocatMock,
      }));

      await avocatController.registerAvocat(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'jean.dupont@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

      expect(User).toHaveBeenCalledWith({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        password: 'hashedPassword',
        phone: '12345678',
        imageprofile: 'http://localhost:7501/uploads/avatar.png',
        isActive: false,
      });

      expect(saveUserMock).toHaveBeenCalled();

      expect(Avocat).toHaveBeenCalledWith({
        utilisateur: undefined, // Car newUser._id n'existe pas dans ce mock, tu peux améliorer en renvoyant _id
        adresse: '123 Rue Paris',
        honoraires: 500,
        region: 'Ile-de-France',
        dateDebutConvention: null,
        dateFinConvention: null,
        degreJuridiction: 'Appel',
      });
      expect(saveAvocatMock).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Avocat inscrit avec succès !",
        user: expect.any(Object),
      }));
    });

    test("doit gérer les erreurs et renvoyer 500", async () => {
      req.body.email = 'fail@example.com';
      User.findOne.mockRejectedValue(new Error('Erreur BDD'));

      await avocatController.registerAvocat(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Erreur lors de l'inscription.",
        error: expect.any(Error),
      }));
    });
  });

  describe('getAllAvocatSorted', () => {
    test('doit retourner la liste triée des avocats', async () => {
      const fakeAvocats = [
        {
          _id: '1',
          adresse: 'adresse1',
          dateDebutConvention: null,
          dateFinConvention: null,
          region: 'region1',
          honoraires: 100,
          degreJuridiction: 'Première Instance',
          affairesAttribuees: [],
          utilisateur: {
            _id: 'u1',
            nom: 'Nom1',
            prenom: 'Prenom1',
            email: 'email1@example.com',
            phone: '111',
            imageprofile: 'url1'
          }
        },
        {
          _id: '2',
          adresse: 'adresse2',
          dateDebutConvention: null,
          dateFinConvention: null,
          region: 'region2',
          honoraires: 200,
          degreJuridiction: 'Appel',
          affairesAttribuees: ['aff1'],
          utilisateur: {
            _id: 'u2',
            nom: 'Nom2',
            prenom: 'Prenom2',
            email: 'email2@example.com',
            phone: '222',
            imageprofile: 'url2'
          }
        },
      ];

      Avocat.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(fakeAvocats),
      });

      await avocatController.getAllAvocatSorted(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();

      const responseArg = res.json.mock.calls[0][0];
      expect(responseArg[0].degreJuridiction).toBe('Appel'); // tri correct
      expect(responseArg[1].degreJuridiction).toBe('Première Instance');
    });

    test('doit gérer les erreurs dans getAllAvocatSorted', async () => {
      Avocat.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('Erreur')),
      });

      await avocatController.getAllAvocatSorted(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Erreur lors de la récupération des avocats',
        error: expect.any(Error),
      }));
    });
  });
});
