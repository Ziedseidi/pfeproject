const express = require('express');
const clientController =require('../controllers/client.Controller');
const router=express.Router();

router.post('/register_Client', clientController.registerClient);

module.exports= router;
