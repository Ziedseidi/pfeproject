const express = require('express');
const router=express.Router();
const uploadImage = require('../midelware/multer');  // Assure-toi d'importer multer ici
const dossierController=require('../controllers/dossier.Controller');
const authenticateToken=require('../midelware/auth');
const roleMiddleware =require('../midelware/rbac');



router.post('/ajouter-Dossier', authenticateToken,uploadImage.array('imagesFichier', 10),roleMiddleware('Avocat'),dossierController.AjouterDossier);
router.get('/Dossiers',authenticateToken,roleMiddleware('PersonelJurédique'),dossierController.AfficherTousLesDossiers),
router.get('/dossier/:id',authenticateToken,roleMiddleware('PersonelJurédique'),dossierController.AfficherDetailsDossier);
module.exports = router;

