const Affaire = require('../models/Affaire.model')
const Consignation = require('../models/Consignation.model');
const Saisie = require('../models/Saisie.model');
const generatePaymentInvoice = require('../utils/generateFacturePDF');
const path = require('path');
const fs = require('fs');

const factureController={};

factureController.downloadInvoiceByNumeroAffaire = async (req, res) => {
  try {
    const { numeroAffaire } = req.params;

    // Chercher l'affaire avec ce numéro
    const affaire = await Affaire.findOne({ numeroAffaire })
      .populate('consignations')
      .populate('saisies');

    if (!affaire) {
      return res.status(404).json({ error: "Affaire introuvable" });
    }

    // Trouver un paiement payé (consignation ou saisie)
    let paiement = null;
    let type = null;

    paiement = affaire.consignations.find(c => c.paymentStatus === 'paid');
    if (paiement) {
      type = 'consignation';
    } else {
      paiement = affaire.saisies.find(s => s.paymentStatus === 'paid');
      if (paiement) {
        type = 'saisie';
      }
    }

    if (!paiement) {
      return res.status(400).json({ error: "Aucun paiement payé trouvé pour cette affaire." });
    }

    // Chemin temporaire du PDF
    const invoicePath = path.join(__dirname, '..', 'invoices', `${type}_${paiement._id}.pdf`);

    await generatePaymentInvoice(type, paiement._id, invoicePath);

    res.download(invoicePath, `facture_${type}_${paiement._id}.pdf`, (err) => {
      if (err) {
        console.error('Erreur lors de l\'envoi du fichier PDF :', err);
        res.status(500).json({ error: 'Erreur lors du téléchargement du fichier' });
      }

      // Supprimer le fichier temporaire
      fs.unlink(invoicePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Erreur suppression fichier temporaire :', unlinkErr);
        }
      });
    });

  } catch (error) {
    console.error('Erreur téléchargement facture:', error);
    res.status(500).json({ error: 'Erreur serveur lors du téléchargement de la facture' });
  }
};

 module.exports= factureController;