const express = require('express');
const router=express.Router();
const affaireController=require('../controllers/affaire.Controller');
const roleMiddleware =require('../midelware/rbac');
const authenticateToken=require('../midelware/auth');



router.post('/add_Affaire',authenticateToken, roleMiddleware('PersonelJurédique'), affaireController.addAffaire);
router.post('/assign_avocat',authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.assignAvocatToAffaire);
router.get('/allAffaires',authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.getAllAffaires);
module.exports = router;



