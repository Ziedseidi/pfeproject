const express=require('express');
const router=express.Router();
const authenticateToken=require('../midelware/auth');
const uploadImage = require('../midelware/multer');  // Assure-toi d'importer multer ici
const roleMiddleware =require('../midelware/rbac');
const tribunalController = require('../controllers/tribunal.Controller');


router.post('/add_Tribunal', authenticateToken,roleMiddleware('Admin'),tribunalController.aadTribunal);

module.exports=router;