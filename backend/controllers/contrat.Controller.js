const Contrat = require('../models/Contrat.model');
const Avocat = require('../models/Avocat.model');
const Demandeur = require('../models/Demandeur.model');
const Affaire = require('../models/Affaire.model');
const path = require('path');
const generateContractPdf = require('../utils/generateContractPdf');

const contratController = {};

contratController.createContrat = async (req, res) => {
  try {
    // Extraire les IDs de la requête
    const { avocatId, demandeurId, affairesIds, ...contratData } = req.body;

    // Vérification que les champs obligatoires sont présents
    if (!avocatId || !demandeurId) {
      return res.status(400).json({ message: 'Les champs avocatId et demandeurId sont requis.' });
    }

    const contrat = new Contrat({
      ...contratData,
      avocat: avocatId, 
      demandeur: demandeurId, 
      affaires: affairesIds, 
    });

    await contrat.save();

    const avocat = await Avocat.findById(avocatId);
    const demandeur = await Demandeur.findById(demandeurId);
    const affaires = await Affaire.find({ _id: { $in: affairesIds } });

    // Génération du fichier PDF
    const fileName = `contrat_${contrat._id}.pdf`;
    const filePath = path.join(__dirname, '../pdfs', fileName);
    await generateContractPdf(contrat, avocat, demandeur, affaires, filePath);

    // Mise à jour du contrat avec le nom du fichier PDF
    contrat.fichier = fileName;
    await contrat.save();

    // Réponse avec le contrat créé
    res.status(201).json(contrat);
  } catch (err) {
    console.error('Erreur création contrat :', err);
    res.status(500).json({ message: 'Erreur création du contrat' });
  }
};

module.exports = contratController;
