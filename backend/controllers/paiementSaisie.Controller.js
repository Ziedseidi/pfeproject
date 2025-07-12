const Saisie = require('../models/Saisie.model');
const stripe = require('../utils/stripeClient');

const paiementSaisieController = {};


paiementSaisieController.getSaisieByNumeroAffaire = async (req, res) => {
  try {
    const { numeroAffaire } = req.params;

    // Cherche une saisie dont l'affaire correspond à ce numeroAffaire
    const saisie = await Saisie.findOne()
      .populate({
        path: 'affaire',
        match: { numeroAffaire }  // Filtre sur le numéro d'affaire
      });

    if (!saisie || !saisie.affaire) {
      return res.status(404).json({ error: 'Saisie non trouvée pour ce numéro d\'affaire' });
    }

    res.json({
      montant: saisie.montantSaisi,
      paymentStatus: saisie.paymentStatus,
      saisieId: saisie._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

paiementSaisieController.createPaymentIntentForSaisie = async (req, res) => {
  console.log('Route createPaymentIntentForSaisie appelée avec body:', req.body);
  try {
    const { saisieId } = req.body;
    if (!saisieId) {
      return res.status(400).json({ error: 'saisieId requis' });
    }

    const saisie = await Saisie.findById(saisieId);
    console.log('Saisie trouvée:', saisie);

    if (!saisie) {
      return res.status(404).json({ error: 'Saisie non trouvée' });
    }

    if (saisie.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Cette saisie est déjà payée' });
    }

    const amount = Math.round(saisie.montantSaisi * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      montant: saisie.montantSaisi
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur création PaymentIntent' });
  }
};





paiementSaisieController.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, saisieId } = req.body;
    if (!paymentIntentId || !saisieId) {
      return res.status(400).json({ error: 'paymentIntentId et saisieId requis' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Le paiement n\'est pas encore confirmé par Stripe' });
    }

    await Saisie.findByIdAndUpdate(saisieId, { paymentStatus: 'paid' });

    res.json({ status: 'COMPLETED' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur confirmation paiement' });
  }
};

module.exports = paiementSaisieController;
