const express = require('express');
const router = express.Router();
const paiementSaisieController = require('../controllers/paiementSaisie.Controller');

router.get('/:numeroAffaire', paiementSaisieController.getSaisieByNumeroAffaire);
router.post('/create-payment-intent', paiementSaisieController.createPaymentIntentForSaisie);
router.post('/confirm-payment', paiementSaisieController.confirmPayment);

module.exports = router;
