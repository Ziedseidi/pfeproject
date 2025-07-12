const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiement.Controller');

// Lire la consignation par numéro d'affaire
router.get('/consignation/affaire/:numAffaire', paiementController.getConsignationByNumeroAffaire);

// Créer le PaymentIntent Stripe (montant = en DB)
router.post('/consignation/create-payment-intent', paiementController.createPaymentIntentForConsignation);

// Confirmer le paiement après succès Stripe
router.post('/consignation/confirm-payment', paiementController.confirmPayment);

module.exports = router;
