const express = require('express');
const router = express.Router();
const authenticateToken = require('../midelware/auth');
const uploadImage = require('../midelware/multer');  // Importation de multer pour gérer l'upload de l'image
const roleMiddleware = require('../midelware/rbac');
const tribunalController = require('../controllers/tribunal.Controller');

router.post('/add_Tribunal',authenticateToken, roleMiddleware('Admin'),  uploadImage.single('imageTribunal'),tribunalController.addTribunal );
router.get('/Tribunaux',authenticateToken,roleMiddleware('Admin'),tribunalController.getTribunauxClassifies);
router.patch('/toggleAllTribunaux', authenticateToken, roleMiddleware('Admin'), tribunalController.toggleAllTribunaux);

module.exports = router;
