const express = require('express');
const router = express.Router();
const contratController = require('../controllers/contrat.Controller');
const authenticateToken=require('../midelware/auth');
const roleMiddleware =require('../midelware/rbac');
const affaireController = require('../controllers/affaire.Controller');


router.post('/ajouterContrat',authenticateToken,roleMiddleware('PersonelJurédique') ,contratController.createContrat);
router.get('/Pdfs',authenticateToken,roleMiddleware('Avocat'),contratController.getPdfContratsByAvocat),
router.put('/:id/accepter', authenticateToken,roleMiddleware('Avocat'),contratController.accepterContrat);
router.put('/:id/refuser', authenticateToken,roleMiddleware('Avocat'),contratController.refuserContrat);
router.get('/staticContrat',authenticateToken,roleMiddleware('Admin'),contratController.countContratsBtEtat),


module.exports = router;
