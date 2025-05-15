const express = require('express');
const router = express.Router();
const contratController = require('../controllers/contrat.Controller');
const authenticateToken=require('../midelware/auth');
const roleMiddleware =require('../midelware/rbac');
const affaireController = require('../controllers/affaire.Controller');


router.post('/ajouterContrat',authenticateToken,roleMiddleware('PersonelJurédique') ,contratController.createContrat);
router.get('/Mes-Contrats',authenticateToken,roleMiddleware('Avocat'),affaireController.getContratsByAvocat),

module.exports = router;
