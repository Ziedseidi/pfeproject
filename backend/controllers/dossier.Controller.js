const express = require('express');
const router = express.Router();
const uploadImage= require('../midelware/multer'); // Importer le middleware multer
const Dossier = require('../models/Dossier.model');
const Avocat = require('../models/Avocat.model');

const dossierController = {};

dossierController.AjouterDossier = async (req, res) => {
  try {
    const { numeroAffaire, titre, description } = req.body;

    // Récupérer l'ID de l'utilisateur connecté (avocat) depuis le token
    const avocatId = req.user.userId; 

    // Vérifier si l'avocat existe dans la base de données en utilisant l'ID récupéré
    const avocat = await Avocat.findOne({ utilisateur: avocatId });
    if (!avocat) {
      return res.status(400).json({ message: 'Avocat non trouvé' });
    }

    console.log('Files:', req.files); 

    // Gérer les fichiers téléchargés
    let imagesFichier = [];
    if (req.files) {
      imagesFichier = req.files.map(file => 'http://localhost:7501/uploads/' + file.filename);
    }

    // Créer un nouveau dossier
    const dossier = new Dossier({
      numeroAffaire,
      titre,
      description,
      avocat: avocatId,  // Utilisation de l'ID de l'avocat connecté
      imagesFichier,
      dateCreation: Date.now(),
    });

    await dossier.save();

    res.status(201).json({ message: 'Dossier ajouté avec succès', dossier });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du dossier' });
  }
};

dossierController.AfficherTousLesDossiers = async (req, res) => {
  try {
    const dossiers = await Dossier.find({}, 'titre numeroAffaire').lean(); // projection
    res.status(200).json(dossiers); // [{ _id, titre, numeroAffaire }]
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des dossiers' });
  }
};

dossierController.AfficherDetailsDossier = async (req, res) => {
  try {
    const { id } = req.params;

    const dossier = await Dossier.findById(id)
      .populate({
        path: 'avocat',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom email  -_id'
        }
      })
      .lean();

    if (!dossier) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }

    const utilisateur = dossier.avocat?.utilisateur || {};

    res.status(200).json({
      _id: dossier._id,
      numeroAffaire: dossier.numeroAffaire,
      titre: dossier.titre,
      description: dossier.description,
      dateCreation: dossier.dateCreation,
      imagesFichier: dossier.imagesFichier,
      nomAvocat: utilisateur.nom || null,
      prenomAvocat: utilisateur.prenom || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération du dossier' });
  }
};



module.exports = dossierController;
