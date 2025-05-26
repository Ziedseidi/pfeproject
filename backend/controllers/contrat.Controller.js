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
      etat,
      ...contratData
    } = req.body;

    // Vérification des champs requis
    if (!avocatNom || !avocatPrenom || !demandeurNom || !demandeurPrenom || !numeroAffaire) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    // Trouver l'utilisateur avocat
    const utilisateurAvocat = await User.findOne({ nom: avocatNom, prenom: avocatPrenom });
    if (!utilisateurAvocat) {
      return res.status(404).json({ message: "Utilisateur avocat introuvable." });
    }

    const avocat = await Avocat.findOne({ utilisateur: utilisateurAvocat._id });
    if (!avocat) {
      return res.status(404).json({ message: "Avocat introuvable." });
    }

    const utilisateurDemandeur = await User.findOne({ nom: demandeurNom, prenom: demandeurPrenom });
    if (!utilisateurDemandeur) {
      return res.status(404).json({ message: "Utilisateur demandeur introuvable." });
    }

    const demandeur = await Demandeur.findOne({ utilisateur: utilisateurDemandeur._id });
    if (!demandeur) {
      return res.status(404).json({ message: "Demandeur introuvable." });
    }

    const numeroAffaireArray = Array.isArray(numeroAffaire) ? numeroAffaire : [numeroAffaire];
    const affaires = await Affaire.find({ numeroAffaire: { $in: numeroAffaireArray } });
    if (affaires.length === 0) {
      return res.status(404).json({ message: "Aucune affaire trouvée avec les numéros fournis." });
    }

    const contrat = new Contrat({
      ...contratData,
      avocat: avocat._id,
      demandeur: demandeur._id,
      affaires: affaires.map(a => a._id),
      etat: ['en attente', 'accepté', 'refusé'].includes(etat) ? etat : 'en attente'
    });

    await contrat.save();

    // Lier le contrat à l'avocat
    avocat.contrats.push(contrat._id);
    await avocat.save();

    // Génération du fichier PDF
    const fileName = `contrat_${contrat._id}.pdf`;
    const filePath = path.join(__dirname, '../pdfs', fileName);
    await generateContractPdf(contrat, avocat, demandeur, affaires, filePath);

    contrat.fichier = fileName;
    await contrat.save();

    return res.status(201).json(contrat);

  } catch (err) {
    console.error('Erreur création contrat :', err);
    return res.status(500).json({ message: 'Erreur lors de la création du contrat.' });
  }
};
contratController.getPdfContratsByAvocat = async (req, res) => {
  try {
    const utilisateurId = req.user.userId;

    // Trouver l'avocat lié à l'utilisateur connecté
    const avocat = await Avocat.findOne({ utilisateur: utilisateurId });
    if (!avocat) {
      return res.status(404).json({ message: "Avocat non trouvé." });
    }

    // Récupérer les contrats avec le fichier
    const contrats = await Contrat.find({ avocat: avocat._id }, 'fichier');

    if (!contrats || contrats.length === 0) {
      return res.status(404).json({ message: "Aucun contrat assigné à cet avocat." });
    }

    // Filtrer les contrats avec fichier et construire la réponse avec uniquement _id et url
    const pdfs = contrats
      .filter(c => c.fichier)
      .map(c => ({
        _id: c._id,
        url: `http://localhost:7501/pdfs/${c.fichier}`
      }));

    return res.status(200).json(pdfs);
  } catch (error) {
    console.error("Erreur dans la récupération des PDFs:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

contratController.accepterContrat = async (req, res) => {
  const { id } = req.params;
  try {
    const contrat = await Contrat.findByIdAndUpdate(
      id,
      { etat: 'accepté' },
      { new: true }
    );
    if (!contrat) return res.status(404).json({ message: 'Contrat introuvable' });
    res.json({ message: 'Contrat accepté avec succès', contrat });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

contratController.refuserContrat = async (req, res) => {
  const { id } = req.params;
  try {
    const contrat = await Contrat.findByIdAndUpdate(
      id,
      { etat: 'refusé' },
      { new: true }
    );
    if (!contrat) return res.status(404).json({ message: 'Contrat introuvable' });
    res.json({ message: 'Contrat refusé avec succès', contrat });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


 module.exports=contratController;
