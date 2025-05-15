const Contrat = require('../models/Contrat.model');
const Avocat = require('../models/Avocat.model');
const Demandeur = require('../models/Demandeur.model');
const User = require('../models/User.model');
const Affaire = require('../models/Affaire.model');
const path = require('path');
const generateContractPdf = require('../utils/generateContractPdf');

const contratController = {};

contratController.createContrat = async (req, res) => {
  try {
    const {
      avocatNom,
      avocatPrenom,
      demandeurNom,
      demandeurPrenom,
      numeroAffaire,
      ...contratData
    } = req.body;

    if (!avocatNom || !avocatPrenom || !demandeurNom || !demandeurPrenom || !numeroAffaire) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    // Trouver l'utilisateur avocat
    const utilisateurAvocat = await User.findOne({ nom: avocatNom, prenom: avocatPrenom });
    if (!utilisateurAvocat) {
      return res.status(404).json({ message: "Utilisateur avocat introuvable." });
    }

    // Trouver l'avocat lié à cet utilisateur
    const avocat = await Avocat.findOne({ utilisateur: utilisateurAvocat._id });
    if (!avocat) {
      return res.status(404).json({ message: "Avocat introuvable." });
    }

    // Trouver l'utilisateur demandeur
    const utilisateurDemandeur = await User.findOne({ nom: demandeurNom, prenom: demandeurPrenom });
    if (!utilisateurDemandeur) {
      return res.status(404).json({ message: "Utilisateur demandeur introuvable." });
    }

    // Trouver le demandeur lié à cet utilisateur
    const demandeur = await Demandeur.findOne({ utilisateur: utilisateurDemandeur._id });
    if (!demandeur) {
      return res.status(404).json({ message: "Demandeur introuvable." });
    }

    // Récupérer les affaires
    const numeroAffaireArray = Array.isArray(numeroAffaire) ? numeroAffaire : [numeroAffaire];
    const affaires = await Affaire.find({ numeroAffaire: { $in: numeroAffaireArray } });
    if (affaires.length === 0) {
      return res.status(404).json({ message: "Aucune affaire trouvée avec les numéros fournis." });
    }

    // Créer le contrat (avocat est un ObjectId simple)
    const contrat = new Contrat({
      ...contratData,
      avocat: avocat._id,          // ici un seul avocat (pas tableau)
      demandeur: demandeur._id,    // assure que ce champ existe dans ton schema Contrat
      affaires: affaires.map(a => a._id),
    });

    await contrat.save();

    // Ajouter ce contrat à la liste des contrats de l'avocat
    avocat.contrats.push(contrat._id);
    await avocat.save();

    // Générer le PDF
    const fileName = `contrat_${contrat._id}.pdf`;
    const filePath = path.join(__dirname, '../pdfs', fileName);
    await generateContractPdf(contrat, avocat, demandeur, affaires, filePath);

    // Sauvegarder le nom du fichier dans contrat
    contrat.fichier = fileName;
    await contrat.save();

    return res.status(201).json(contrat);

  } catch (err) {
    console.error('Erreur création contrat :', err);
    return res.status(500).json({ message: 'Erreur création du contrat' });
  }
};

module.exports = contratController;
