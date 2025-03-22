const express = require('express');
const clientController = require('../controllers/client.Controller');
const uploadImage = require('../midelware/multer');  // Assure-toi d'importer multer ici
const router = express.Router();

router.post('/register_Client', uploadImage.single('imageprofile'), clientController.registerClient);

module.exports = router;
