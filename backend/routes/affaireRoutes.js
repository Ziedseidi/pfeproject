const express = require('express');
const router=express.Router();
const affaireController=require('../controllers/affaire.Controller');
const roleMiddleware =require('../midelware/rbac');
const authenticateToken=require('../midelware/auth');



router.post('/add_Affaire',authenticateToken, roleMiddleware('Client'), affaireController.addAffaire);
router.post('/assign_avocat',authenticateToken,roleMiddleware('Admin'),affaireController.assignAvocatToAffaire);

module.exports = router;



