// controllers/affaire.Controller.js
const mongoose = require('mongoose');
const Affaire = require('../models/Affaire.model');
const User = require('../models/User.model');
const Avocat = require('../models/Avocat.model');
const Expert = require('../models/Expert.model');
const Demandeur = require('../models/Demandeur.model');
const Saisie = require('../models/Saisie.model');
const Consignation = require('../models/Consignation.model');
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
    if (!req.user?.userId) {
      return res.status(400).json({ message: 'Utilisateur non authentifié' });
    }
    const demandeurId = req.user.userId;
    const newAffaire = new Affaire({
      numeroAffaire,
      objet,
      avocat: null,
      tribunal: tribunal || null,
      dateConvocation: dateConvocation || Date.now(),
      degreJuridique,
      dateCloture: dateCloture || null,
      clotureApresReception: !!clotureApresReception,
      remarques: remarques || null,
      reclamation: reclamation || null,
      experts: [],
      consignations: [],
      saisies: [],
      typeClient,
      demandeur: demandeurId,
      numeroVol: typeClient === 'passager' ? numeroVol : null,
      dateVol: typeClient === 'passager' ? dateVol : null,
      referenceConvention: null
    });
    await newAffaire.save();
    return res.status(201).json({
      message: 'Affaire ajoutée avec succès',
      affaire: newAffaire
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'affaire:', error);
    return res.status(500).json({
      message: 'Erreur lors de l\'ajout de l\'affaire.',
      error: error.message || error
    });
  }
};

affaireController.assignAvocatToAffaire = async (req, res) => {
  try {
    const { utilisateurId, affaireId } = req.body;
    if (!utilisateurId || !affaireId) {
      return res.status(400).json({ message: "L'ID utilisateur et l'ID affaire sont requis." });
    }
    const user = await User.findById(utilisateurId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    const avocat = await Avocat.findOne({ utilisateur: utilisateurId }).populate('affairesAttribuees');
    if (!avocat) {
      return res.status(404).json({ message: "Aucun avocat pour cet utilisateur." });
    }
    if (avocat.affairesAttribuees.length >= 10) {
      return res.status(403).json({ message: "Cet avocat a déjà 10 affaires." });
    }
    const affaire = await Affaire.findById(affaireId);
    if (!affaire) {
      return res.status(404).json({ message: "Affaire non trouvée." });
    }

    const degreAffaire = affaire.degreJuridique.toLowerCase();
    const degreAvocat = avocat.degreJuridiction;

    const valid =
      (degreAffaire === '1er degré' && degreAvocat === 'Appel') ||
      (degreAffaire === '2ème degré' && (degreAvocat === 'Appel' || degreAvocat === 'Première Instance')) ||
      (degreAffaire === '3ème degré' && degreAvocat === 'Cassation');

    if (!valid) {
      return res.status(403).json({ message: "Avocat inadapté pour ce degré juridique." });
    }

    affaire.avocat = avocat._id;
    affaire.referenceConvention = uuidv4();
    await affaire.save();

    avocat.dateDebutConvention = new Date();
    avocat.affairesAttribuees.push(affaire._id);
    await avocat.save();

    return res.status(200).json({ message: "Affaire assignée avec succès." });
  } catch (error) {
    console.error("Erreur assignation :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

affaireController.getAllAffaires = async (req, res) => {
  try {
    // On récupère en lean + populate
    let affaires = await Affaire.find()
      .populate({
        path: 'avocat',
        select: 'utilisateur -_id',
        populate: { path: 'utilisateur', select: 'nom prenom -_id' }
      })
      .populate({
        path: 'experts',
        select: 'utilisateur -_id',
        populate: { path: 'utilisateur', select: 'nom prenom -_id' }
      })
      .populate({
        path: 'demandeur',
        select: 'utilisateur -_id',
        populate: { path: 'utilisateur', select: 'nom prenom -_id' }
      })
      .populate({ path: 'tribunal', select: 'nom -_id' })
      .populate({ path: 'saisies', select: '-__v' })
      .populate({ path: 'consignations', select: '-__v' })
      .sort({ createdAt: -1 })
      .lean();

    // Aplatir les sous‑objets
    affaires = affaires.map(a => {
      if (a.avocat?.utilisateur) a.avocat = a.avocat.utilisateur;
      if (Array.isArray(a.experts)) {
        a.experts = a.experts.map(e => e.utilisateur || e);
      }
      if (a.demandeur?.utilisateur) a.demandeur = a.demandeur.utilisateur;
      return a;
    });

    return res.status(200).json(affaires);
  } catch (error) {
    console.error('Erreur récupération affaires :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};


affaireController.getAvocatsEligibles= async(req,res)=>{
  try {
    const { affaireId } = req.params;
    const affaire = await Affaire.findById(affaireId);
    if (!affaire) {
      return res.status(404).json({ message: "Affaire non trouvée" });
    }

    const degreAffaire = affaire.degreJuridique.toLowerCase();

    let condition;
    if (degreAffaire === '1er degré') {
      condition = { degreJuridiction: 'Appel' };
    } else if (degreAffaire === '2ème degré') {
      condition = { degreJuridiction: { $in: ['Appel', 'Première Instance'] } };
    } else if (degreAffaire === '3ème degré') {
      condition = { degreJuridiction: 'Cassation' };
    } else {
      return res.status(400).json({ message: "Degré juridique invalide." });
    }

    const avocats = await Avocat.find(condition)
      .populate('utilisateur', 'nom prenom email')
      .lean();

    const disponibles = avocats.filter(a => (a.affairesAttribuees?.length || 0) < 10);

    return res.status(200).json(disponibles);
  } catch (error) {
    console.error("Erreur getAvocatsEligibles :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


module.exports = affaireController;
