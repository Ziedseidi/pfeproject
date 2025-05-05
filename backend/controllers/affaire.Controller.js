// controllers/affaire.Controller.js
const mongoose = require('mongoose');
const Affaire = require('../models/Affaire.model');
const User = require('../models/User.model');
const Avocat = require('../models/Avocat.model');
const Expert = require('../models/Expert.model');
const Demandeur = require('../models/Demandeur.model');
const Saisie = require('../models/Saisie.model');
const Consignation = require('../models/Consignation.model');
const Tribunal=require('../models/Tribunal.model');
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

    // Vérification si l'affaire a déjà un avocat assigné
    const affaire = await Affaire.findById(affaireId);
    if (!affaire) {
      return res.status(404).json({ message: "Affaire non trouvée." });
    }

    if (affaire.avocat) {
      return res.status(403).json({ message: "Cette affaire est déjà occupée par un autre avocat." });
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
    // Récupérer toutes les affaires avec les associations nécessaires
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
      .populate({
        path: 'tribunal',
        select: 'nom ville -_id'
      })
      .populate({
        path: 'saisies',
        select: '-__v'
      })
      .populate({
        path: 'consignations', 
        select: 'montant dateConsignation dateRecuperation -_id ' // Récupère la dateConsignation correctement
      })
      .sort({ createdAt: -1 })
      .lean();

    affaires = affaires.map(a => {
      if (a.avocat?.utilisateur) a.avocat = a.avocat.utilisateur;

      // Modification de la liste d'experts
      if (Array.isArray(a.experts)) {
        a.experts = a.experts.map(e => e.utilisateur || e);
      }

      if (a.demandeur?.utilisateur) a.demandeur = a.demandeur.utilisateur;

      if (Array.isArray(a.consignations) && a.consignations.length > 0) {
        const consignation = a.consignations[0];  // Assumer qu'il y a au moins une consignation
        a.consignment = {
          montant: consignation.montant,
          dateConsignation: consignation.dateConsignation  // Assurez-vous que vous utilisez dateConsignation ici
        };
      }

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

affaireController.assignTribunalToAffaire = async (req, res) => {
  try {
    const { affaireId, tribunalId } = req.body;

    // Trouver l'affaire
    const affaire = await Affaire.findById(affaireId);
    if (!affaire) {
      return res.status(404).json({ message: "Affaire non trouvée." });
    }

    // Vérifier si un tribunal est déjà assigné à l'affaire
    if (affaire.tribunal) {
      return res.status(400).json({ message: "Un tribunal est déjà assigné à cette affaire." });
    }

    // Vérifier que l'affaire a un avocat assigné
    if (!affaire.avocat) {
      return res.status(400).json({ message: "Aucun avocat assigné à cette affaire." });
    }

    // Récupérer l'avocat
    const avocat = await Avocat.findById(affaire.avocat);
    if (!avocat || !avocat.region) {
      return res.status(400).json({ message: "L'avocat n'a pas de région définie." });
    }

    // Récupérer le tribunal
    const tribunal = await Tribunal.findById(tribunalId);
    if (!tribunal) {
      return res.status(404).json({ message: "Tribunal non trouvé." });
    }

    // Vérifier la compatibilité régionale
    if (tribunal.ville.toLowerCase() !== avocat.region.toLowerCase()) {
      return res.status(400).json({ message: "Le tribunal n'est pas dans la même région que l'avocat." });
    }

    affaire.tribunal = tribunalId;
    await affaire.save();

    return res.status(200).json({ message: "Tribunal affecté à l'affaire avec succès." });

  } catch (error) {
    console.error("Erreur dans l'affectation du tribunal :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


affaireController.searchAffaire = async (req, res) => {
  try {
    const numeroAffaire = req.params.numeroAffaire;

    const affaire = await Affaire.findOne({ numeroAffaire })
      .populate({
        path: 'avocat',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom'
        }
      })
      .populate({
        path: 'tribunal',
        select: 'nom ville typeTribunal imagetribunal -_id' // Ajoute imagetribunal pour l'image du tribunal
      });

    if (!affaire) {
      return res.status(404).json({ message: "Aucune affaire trouvée pour ce numéro." });
    }

    res.status(200).json(affaire);
  } catch (error) {
    console.error("Erreur lors de la recherche de l'affaire :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


affaireController.getTribunauxCompatible = async (req,res)=>{
  try{
    const {affaireId }= req.params;
    const affaire=await Affaire.findById(affaireId).populate('avocat');
    if (!affaire || !affaire.avocat || !affaire.avocat.region) {
      return res.status(400).json({ message: "Affaire invalide ou avocat sans région" });
  }
  const tribunauxCompatibles = await Tribunal.find({ ville: affaire.avocat.region });
  res.status(200).json(tribunauxCompatibles);

} catch (error) {
  console.error("Erreur dans getTribunauxCompatibles", error);
  res.status(500).json({ message: "Erreur serveur" });
};
}




affaireController.assigneConsignation = async (req, res) => {
  const { affaireId, montant, dateConsignation } = req.body;

  try {
    // Vérification de l'ID de l'affaire
    if (!mongoose.Types.ObjectId.isValid(affaireId)) {
      return res.status(400).json({ message: "ID d'affaire invalide" });
    }

    const affaire = await Affaire.findById(affaireId);

    if (!affaire) {
      return res.status(404).json({ message: "Affaire non trouvée" });
    }

    // Si dateConsignation n'est pas précisé, utiliser la date actuelle
    const consignationDate = dateConsignation || Date.now();

    const consignation = await Consignation.create({
      affaire: affaire._id, // Utilisation de _id de l'affaire
      montant,
      dateConsignation: consignationDate, 
    });

    affaire.consignations.push(consignation._id);
    await affaire.save();

    res.status(201).json({
      message: "Consignation créée et assignée avec succès",
      consignation,
    });
  } catch (error) {
    console.error("Erreur consignation :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

affaireController.assigneSaisie = async (req, res) => {
  const { affaireId, objetsSaisis, dateAudience, numeroSaisie, nomAdverse, numeroPV, montantSaisi } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(affaireId)) {
      return res.status(400).json({ message: "ID d'affaire invalide" });
    }

    const affaire = await Affaire.findById(affaireId);

    if (!affaire) {
      return res.status(404).json({ message: "Affaire non trouvée" });
    }

    const saisie = await Saisie.create({
      affaire: affaire._id, 
      objetsSaisis,
      dateAudience,
      numeroSaisie,
      nomAdverse,
      numeroPV,
      montantSaisi, 
    });

    affaire.saisies.push(saisie._id);
    await affaire.save();

    res.status(201).json({
      message: "Saisie créée et assignée avec succès",
      saisie,
    });
  } catch (error) {
    console.error("Erreur saisie :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};



module.exports = affaireController;
