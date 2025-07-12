const Consignation = require('../models/Consignation.model');
const stripe = require('../utils/stripeClient');

const paiementController = {};

/**
 * ✅ Obtenir les infos d'une consignation par numéro d'affaire
 */
paiementController.getConsignationByNumeroAffaire = async (req, res) => {
  try {
    const { numAffaire } = req.params;

    const consignation = await Consignation.findOne()
      .populate({
        path: 'affaire',
        match: { numeroAffaire: numAffaire }
      });

    if (!consignation || !consignation.affaire) {
      return res.status(404).json({ error: 'Consignation pour cette affaire non trouvée' });
    }

    res.json({
      montant: consignation.montant,
      paymentStatus: consignation.paymentStatus,
      consignationId: consignation._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * ✅ Créer un PaymentIntent pour une consignation
 *  - On récupère le montant en base de données via consignationId
 */
paiementController.createPaymentIntentForConsignation = async (req, res) => {
  try {
    const { consignationId } = req.body;
    if (!consignationId) {
      return res.status(400).json({ error: 'consignationId requis' });
    }

    // ➜ Lire la consignation en DB
    const consignation = await Consignation.findById(consignationId);
    if (!consignation) {
      return res.status(404).json({ error: 'Consignation non trouvée' });
    }

    if (consignation.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Cette consignation est déjà payée' });
    }

    // ➜ Stripe attend des centimes
    const amount = Math.round(consignation.montant * 100);

    // ➜ Créer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      montant: consignation.montant
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur création PaymentIntent' });
  }
};

/**
 * ✅ Confirmer et marquer la consignation comme payée en DB
 *  - Frontend doit appeler ça après le paiement réussi côté Stripe
 */
paiementController.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, consignationId } = req.body;
    if (!paymentIntentId || !consignationId) {
      return res.status(400).json({ error: 'paymentIntentId et consignationId requis' });
    }

    // ➜ Vérifier le statut du paiement chez Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Le paiement n\'est pas encore confirmé par Stripe' });
    }

    // ➜ Marquer la consignation comme payée
    await Consignation.findByIdAndUpdate(consignationId, { paymentStatus: 'paid' });

    res.json({ status: 'COMPLETED' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur confirmation paiement' });
  }
};

module.exports = paiementController;
