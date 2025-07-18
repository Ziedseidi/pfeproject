const express = require('express');
const router = express.Router();
const factureController = require('../controllers/factureController');


router.get('/:numeroAffaire', factureController.downloadInvoiceByNumeroAffaire);

module.exports = router;
