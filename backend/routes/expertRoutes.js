const express= require('express');
const router=express.Router();
const expertController=require('../controllers/expert.Controller');
const uploadImage = require('../midelware/multer'); 

router.post('/register_Expert', uploadImage.single('imageprofile'),expertController.registerexpert);

module.exports=router;