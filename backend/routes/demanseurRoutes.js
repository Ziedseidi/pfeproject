const express = require('express');
const demandeurController= require('../controllers/demandeur.Controller');
const uploadImage = require('../midelware/multer');  // Assure-toi d'importer multer ici
const router = express.Router();

router.post('/register_PersonelJuredique', uploadImage.single('imageprofile'), demandeurController.registerDemandeur);

module.exports = router;
