const mongoose = require('mongoose');
const Affaire = require('../models/Affaire.model');
const Demandeur = require('../models/Demandeur.model');
const User = require('../models/User.model');
const Avocat=require('../models/Avocat.model');
const { v4: uuidv4 } = require('uuid');


const affaireController = {};

affaireController.addAffaire = async (req, res) => {
  const {
    numeroAffaire,
    objet,
    tribunal,
    dateConvocation,
    degreJuridique,
    dateCloture,
    clotureApresReception,
    remarques,
    reclamation,
    typeClient,
    numeroVol,
    dateVol
  } = req.body;

  try {
    // Vérification de l'utilisateur authentifié
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: 'Utilisateur non authentifié' });
    }

    // Utilisation de l'utilisateur comme demandeur
    const demandeurId = req.user.userId;

    const newAffaire = new Affaire({
      numeroAffaire,
      objet,
      avocat: null,
      tribunal: tribunal || null,
      dateConvocation: dateConvocation || Date.now(),
      degreJuridique,
      dateCloture: dateCloture || null,
      clotureApresReception: clotureApresReception || false,
      remarques: remarques || null,
      reclamation: reclamation || null,
      experts: [],
      consignations: [],
      saisies: [],
      audiences: [],
      typeClient,
      demandeur: demandeurId,  // L'ID de l'utilisateur est utilisé comme demandeur
      numeroVol: typeClient === 'passager' ? numeroVol : null,
      dateVol: typeClient === 'passager' ? dateVol : null,
      referenceConvention: null
    });

    // Sauvegarde de l'affaire dans la base de données
    await newAffaire.save();

    // Retour de la réponse avec l'affaire nouvellement créée
    res.status(201).json({
      message: 'Affaire ajoutée avec succès',
      affaire: newAffaire
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'affaire:', error);
    res.status(500).json({
      message: 'Erreur lors de l\'ajout de l\'affaire.',
      error: error.message || error
    });
  }
};

affaireController.assignAvocatToAffaire = async (req, res) => {
  try {
    const { utilisateurId, affaireId } = req.body;

    // Vérification des paramètres requis
    if (!utilisateurId || !affaireId) {
      return res.status(400).json({ message: "L'ID de l'utilisateur et de l'affaire sont requis." });
    }

    // Recherche de l'utilisateur
    const user = await User.findById(utilisateurId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Recherche de l'avocat associé à cet utilisateur
    const avocat = await Avocat.findOne({ utilisateur: utilisateurId }).populate('affairesAttribuees');
    if (!avocat) {
      return res.status(404).json({ message: "Aucun avocat associé à cet utilisateur." });
    }

    // Vérification du nombre d'affaires attribuées à l'avocat (limité à 10)
    if (avocat.affairesAttribuees.length >= 10) {
      return res.status(403).json({ message: "Impossible d'assigner. Cet avocat est déjà affecté à 10 affaires." });
    }

    // Recherche de l'affaire
    const affaire = await Affaire.findById(affaireId);
    if (!affaire) {
      return res.status(404).json({ message: "Affaire non trouvée." });
    }

    // Assignation de l'avocat à l'affaire et mise à jour de la référence de la convention
    affaire.avocat = avocat._id;
    affaire.referenceConvention = uuidv4();  // Génération de la référence de la convention
    await affaire.save();

    // Mise à jour de la date de début de la convention dans le modèle avocat
    avocat.dateDebutConvention = Date.now();  // Date actuelle comme début de la convention
    await avocat.save();

    // Ajout de l'affaire à la liste des affaires attribuées de l'avocat
    avocat.affairesAttribuees.push(affaire._id);
    await avocat.save();

    // Retourner une réponse indiquant le succès
    return res.status(200).json({ message: "Affaire assignée à l'avocat avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'assignation :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};
module.exports = affaireController;
