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

    // Trouver l'utilisateur demandeur
    const utilisateurDemandeur = await User.findOne({ nom: demandeurNom, prenom: demandeurPrenom });
    if (!utilisateurDemandeur) {
      return res.status(404).json({ message: "Utilisateur demandeur introuvable." });
    }

    const demandeur = await Demandeur.findOne({ utilisateur: utilisateurDemandeur._id });
    if (!demandeur) {
      return res.status(404).json({ message: "Demandeur introuvable." });
    }

    // Récupérer les affaires liées
    const numeroAffaireArray = Array.isArray(numeroAffaire) ? numeroAffaire : [numeroAffaire];
    const affaires = await Affaire.find({ numeroAffaire: { $in: numeroAffaireArray } });
    if (affaires.length === 0) {
      return res.status(404).json({ message: "Aucune affaire trouvée avec les numéros fournis." });
    }

    // Création du contrat avec ou sans état (valide uniquement)
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

    // Récupérer les contrats avec fichier et populate affaires (pour numeroAffaire)
    const contrats = await Contrat.find({ avocat: avocat._id }, 'fichier affaires')
      .populate({
        path: 'affaires',
        select: 'numeroAffaire',  // ne récupérer que numeroAffaire
        options: { limit: 1 }     // si tu veux juste la première affaire
      });

    if (!contrats || contrats.length === 0) {
      return res.status(404).json({ message: "Aucun contrat assigné à cet avocat." });
    }

    // Construire la réponse avec url + numeroAffaire
    const pdfs = contrats
      .filter(c => c.fichier)
      .map(c => {
        const numeroAffaire = (c.affaires && c.affaires.length > 0) ? c.affaires[0].numeroAffaire : 'N/A';
        return {
          url: `http://localhost:7501/pdfs/${c.fichier}`,
          numeroAffaire
        };
      });

    return res.status(200).json(pdfs);

  } catch (error) {
    console.error("Erreur dans la récupération des PDFs:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


 module.exports=contratController;
