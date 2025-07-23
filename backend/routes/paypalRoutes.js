const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiement.Controller');

router.get('/consignation/affaire/:numAffaire', paiementController.getConsignationByNumeroAffaire);

router.post('/consignation/create-payment-intent', paiementController.createPaymentIntentForConsignation);

router.post('/consignation/confirm-payment', paiementController.confirmPayment);

module.exports = router;
