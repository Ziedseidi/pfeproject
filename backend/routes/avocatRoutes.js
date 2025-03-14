const express = require('express');
const router=express.Router();
const avocatController=require('../controllers/avocat.Controller')

router.post('/register_Avocat', avocatController.registerAvocat);


module.exports=router;
