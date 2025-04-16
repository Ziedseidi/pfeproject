const express = require('express');
const router=express.Router();
const avocatController=require('../controllers/avocat.Controller')
const uploadImage = require('../midelware/multer');  // Assure-toi d'importer multer ici
const authenticateToken=require('../midelware/auth');
const roleMiddleware =require('../midelware/rbac');


router.post('/register_Avocat',uploadImage.single('imageprofile'), avocatController.registerAvocat);
router.get('/Avocats',authenticateToken,roleMiddleware('Admin'),avocatController.getAllAvocatSorted);


module.exports=router;
