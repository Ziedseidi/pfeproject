const express = require('express');
const router=express.Router();
const avocatController=require('../controllers/avocat.Controller')
const uploadImage = require('../midelware/multer');  // Assure-toi d'importer multer ici


router.post('/register_Avocat',uploadImage.single('imageprofile'), avocatController.registerAvocat);


module.exports=router;
