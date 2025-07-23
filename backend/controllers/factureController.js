const Affaire = require('../models/Affaire.model');
const generatePaymentInvoice = require('../utils/generateFacturePDF');
const path = require('path');
const fs = require('fs');

const factureController = {};

factureController.downloadInvoiceByNumeroAffaire = async (req, res) => {
  try {
    const { numeroAffaire } = req.params;

    // Récupérer affaire avec consignations et saisies
    const affaire = await Affaire.findOne({ numeroAffaire })
      .populate('consignations')
      .populate('saisies');

    if (!affaire) return res.status(404).json({ error: "Affaire introuvable" });

    // Chercher un paiement payé : consignation d'abord, sinon saisie
    let paiement = affaire.consignations.find(c => c.paymentStatus === 'paid');
    let type = 'consignation';

    if (!paiement) {
      paiement = affaire.saisies.find(s => s.paymentStatus === 'paid');
      type = 'saisie';
    }

    if (!paiement) return res.status(400).json({ error: "Aucun paiement payé trouvé pour cette affaire." });

    // Générer le chemin du PDF
    const invoiceDir = path.join(__dirname, '..', 'invoices');
    if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);
    const invoicePath = path.join(invoiceDir, `${type}_${paiement._id}.pdf`);

    // Générer la facture PDF
    await generatePaymentInvoice(type, paiement._id, invoicePath);

    // Envoyer le fichier PDF
    res.download(invoicePath, `facture_${type}_${paiement._id}.pdf`, err => {
      if (err) {
        console.error('Erreur envoi PDF :', err);
        return res.status(500).json({ error: 'Erreur lors du téléchargement du fichier' });
      }
      // Supprimer fichier temporaire après envoi
      fs.unlink(invoicePath, unlinkErr => {
        if (unlinkErr) console.error('Erreur suppression fichier temporaire :', unlinkErr);
      });
    });

  } catch (error) {
    console.error('Erreur téléchargement facture:', error);
    res.status(500).json({ error: 'Erreur serveur lors du téléchargement de la facture' });
  }
};

module.exports = factureController;
