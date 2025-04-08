const mongoose = require('mongoose');
const Affaire = require('../models/Affaire.model');
const Demandeur = require('../models/Demandeur.model');

const affaireController = {};

// Fonction pour ajouter une affaire
affaireController.addAffaire = async (req, res) => {
    const {
      numeroAffaire,
      objet,
      avocat,
      tribunalAdresse,
      dateConvocation,
      dateAudience,
      dateJugement,
      issue,
      degreJuridiction,
      dateCloture,
      clotureApresReception,
      montantJugement,
      remarques,
      reclamation,
      typeDemandeur,
      numeroVol,
      dateVol
    } = req.body;
  
    try {
      if (!req.user || !req.user.userId) {
        return res.status(400).json({ message: 'Utilisateur non authentifié' });
      }
  
      const demandeur = await Demandeur.findOne({ utilisateur: req.user.userId });
  
      if (!demandeur) {
        return res.status(400).json({ message: 'Demandeur non trouvé pour cet utilisateur.' });
      }
  
      const newAffaire = new Affaire({
        numeroAffaire,
        objet,
        avocat: null,  // L'avocat est null par défaut
        tribunalAdresse,
        dateConvocation,
        dateAudience,
        dateJugement,
        issue,
        degreJuridiction,
        dateCloture,
        clotureApresReception,
        montantJugement,
        remarques,
        reclamation,
        typeDemandeur,
        demandeur: demandeur._id,  // Référence à l'ID du demandeur trouvé
        numeroVol: typeDemandeur === 'passager' ? numeroVol : null,
        dateVol: typeDemandeur === 'passager' ? dateVol : null
      });
  
      // Sauvegarder l'affaire dans la base de données
      await newAffaire.save();
  
      // Répondre avec un message de succès
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
  

module.exports = affaireController;
