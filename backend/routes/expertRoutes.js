const express= require('express');
const router=express.Router();
const expertController=require('../controllers/expert.Controller');

router.post('/register_Expert', expertController.registerexpert);

module.exports=router;