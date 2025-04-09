const mongoose = require('mongoose');
const Affaire = require('../models/Affaire.model');
const Demandeur = require('../models/Demandeur.model');

const affaireController = {};

affaireController.addAffaire = async (req, res) => {
  const {
    numeroAffaire,
    objet,
    tribunal, // nouveau champ : ObjectId du tribunal sélectionné
    dateConvocation,  // la date de convocation envoyée dans le body de la requête
    degreJuridiction,
    dateCloture,
    clotureApresReception,
    remarques,
    reclamation,
    typeDemandeur,
    numeroVol,
    dateVol
  } = req.body;

  try {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: 'Utilisateur non authentifié' });
    }

    // Trouver le demandeur associé à l'utilisateur
    const demandeur = await Demandeur.findOne({ utilisateur: req.user.userId });

    if (!demandeur) {
      return res.status(400).json({ message: 'Demandeur non trouvé pour cet utilisateur.' });
    }

    // Créer une nouvelle affaire
    const newAffaire = new Affaire({
      numeroAffaire,
      objet,
      avocat: null,  // L'avocat est null par défaut
      tribunal: tribunal || null,  // Référence au tribunal, ou null si non spécifié
      dateConvocation: dateConvocation || Date.now(),  // Si pas de date fournie, utiliser la date actuelle
      degreJuridiction: degreJuridiction || null,
      dateCloture: dateCloture || null,
      clotureApresReception: clotureApresReception || false,
      remarques: remarques || null,
      reclamation: reclamation || null,
      experts: [],  // Pas d'experts par défaut
      consignations: [],  // Pas de consignations par défaut
      saisies: [],  // Pas de saisies par défaut
      audiences: [],  // Pas d'audiences par défaut
      typeDemandeur,
      demandeur: demandeur._id,  // Référence au demandeur
      numeroVol: typeDemandeur === 'passager' ? numeroVol : null,  // Si le demandeur est passager, inclure le numéro de vol
      dateVol: typeDemandeur === 'passager' ? dateVol : null  // Si le demandeur est passager, inclure la date de vol
    });

    // Sauvegarder la nouvelle affaire dans la base de données
    await newAffaire.save();

    // Répondre avec un message de succès
    res.status(201).json({
      message: 'Affaire ajoutée avec succès',
      affaire: newAffaire
    });
  } catch (error) {
    // Gérer les erreurs éventuelles
    console.error('Erreur lors de l\'ajout de l\'affaire:', error);
    res.status(500).json({
      message: 'Erreur lors de l\'ajout de l\'affaire.',
      error: error.message || error
    });
  }
};

module.exports = affaireController;
