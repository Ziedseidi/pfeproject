const express = require('express');
const router = express.Router();
const contratController = require('../controllers/contrat.Controller');
const authenticateToken=require('../midelware/auth');
const roleMiddleware =require('../midelware/rbac');


router.post('/ajouterContrat',authenticateToken,roleMiddleware('PersonelJurédique') ,contratController.createContrat);

module.exports = router;
