const Contrat = require('../models/Contrat.model');
const Avocat = require('../models/Avocat.model');
const Demandeur = require('../models/Demandeur.model');
const Affaire = require('../models/Affaire.model');
const path = require('path');
const generateContractPdf = require('../utils/generateContractPdf');

const contratController = {};
contratController.createContrat = async (req, res) => {
  try {
    const { avocatNom, avocatPrenom, demandeurNom, demandeurPrenom, numeroAffaire, ...contratData } = req.body;

    // Vérification que les champs obligatoires sont présents
    if (!avocatNom || !avocatPrenom || !demandeurNom || !demandeurPrenom || !numeroAffaire) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    // Chercher l'avocat par nom + prénom
    const avocat = await Avocat.findOne().populate({
      path: 'utilisateur',
      match: { nom: avocatNom, prenom: avocatPrenom }
    });

    if (!avocat || !avocat.utilisateur) {
      return res.status(404).json({ message: "Avocat introuvable." });
    }

    // Chercher le demandeur par nom + prénom
    const demandeur = await Demandeur.findOne().populate({
      path: 'utilisateur',
      match: { nom: demandeurNom, prenom: demandeurPrenom }
    });

    if (!demandeur || !demandeur.utilisateur) {
      return res.status(404).json({ message: "Demandeur introuvable." });
    }

    // Trouver les affaires par leur numéro
    const affaires = await Affaire.find({ numeroAffaire: { $in: numeroAffaire } });
    if (affaires.length === 0) {
      return res.status(404).json({ message: "Aucune affaire trouvée avec les numéros fournis." });
    }

    // Créer et enregistrer le contrat
    const contrat = new Contrat({
      ...contratData,
      avocat: avocat._id,
      demandeur: demandeur._id,
      affaires: affaires.map(a => a._id),
    });

    await contrat.save();

    // Génération du PDF
    const fileName = `contrat_${contrat._id}.pdf`;
    const filePath = path.join(__dirname, '../pdfs', fileName);
    await generateContractPdf(contrat, avocat, demandeur, affaires, filePath);

    // Mise à jour du contrat avec le nom du fichier PDF
    contrat.fichier = fileName;
    await contrat.save();

    res.status(201).json(contrat);
  } catch (err) {
    console.error('Erreur création contrat :', err);
    res.status(500).json({ message: 'Erreur création du contrat' });
  }
};

module.exports = contratController;
