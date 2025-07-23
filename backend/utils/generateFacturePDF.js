const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Affaire = require('../models/Affaire.model');
const Consignation = require('../models/Consignation.model');
const Saisie = require('../models/Saisie.model');

/**
 * Génère une facture PDF affichant consignation ET saisie
 * @param {'consignation'|'saisie'} typeAppel
 * @param {string} paiementId
 * @param {string} outputPath
 * @returns {Promise<void>}
 */
const generatePaymentInvoice = async (typeAppel, paiementId, outputPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      let paiementDoc = null;
      let affaire = null;

      // Charger le paiement demandé + affaire liée
      if (typeAppel === 'consignation') {
        paiementDoc = await Consignation.findById(paiementId).populate('affaire');
      } else if (typeAppel === 'saisie') {
        paiementDoc = await Saisie.findById(paiementId).populate('affaire');
      } else {
        return reject(new Error('Type de paiement invalide'));
      }
      if (!paiementDoc) return reject(new Error(`${typeAppel} non trouvé.`));

      affaire = paiementDoc.affaire;

      if (!affaire) return reject(new Error('Affaire liée non trouvée'));

      // Vérification que paiement passé est payé
      if (paiementDoc.paymentStatus !== 'paid') {
        return reject(new Error('Le paiement est impayé. Impossible de générer la facture.'));
      }

      // Récupérer la consignation payée (s'il y en a) pour cette affaire
      const consignationPayee = await Consignation.findOne({ affaire: affaire._id, paymentStatus: 'paid' });

      // Récupérer la saisie payée (s'il y en a) pour cette affaire
      const saisiePayee = await Saisie.findOne({ affaire: affaire._id, paymentStatus: 'paid' });

      // Créer dossier sortie si nécessaire
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Init PDF
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
        bufferPages: true,
        layout: 'portrait',
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Couleurs & polices
      const primaryColor = '#1F4E79';
      const secondaryColor = '#E6EFF7';
      const textColor = '#333333';
      const lightText = '#777777';
      const boldFont = 'Helvetica-Bold';
      const regularFont = 'Helvetica';

      // EN-TÊTE
      const logoPath = path.join(__dirname, '..', 'assets', 'Tunisair-logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 30, { width: 100 });
      }
      doc.font(boldFont).fontSize(24).fillColor(primaryColor).text('FACTURE', 400, 40, { align: 'right' });
      doc.font(regularFont).fontSize(9).fillColor(lightText)
        .text('Tunisair - Société Tunisienne de l\'Air', 400, 65, { align: 'right' })
        .text('Centre Juridique', 400, 80, { align: 'right' })
        .text('Aéroport International de Tunis-Carthage', 400, 95, { align: 'right' })
        .text('Tél: (00216) 71 754 000', 400, 110, { align: 'right' })
        .text('Email: juridique@tunisair.com.tn', 400, 125, { align: 'right' });

      doc.moveTo(50, 150).lineTo(550, 150).strokeColor(primaryColor).lineWidth(1).stroke();

      // INFORMATIONS FACTURE
      let y = 170;
      const invoiceInfo = {
        'N° Facture': `TUN-${typeAppel.slice(0, 3).toUpperCase()}-${paiementId.toString().slice(-6)}`,
        'Date': new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        'Statut': 'Payé'
      };

      doc.font(boldFont).fontSize(12).fillColor(primaryColor).text('INFORMATIONS DE LA FACTURE', 50, y);
      y += 20;
      Object.entries(invoiceInfo).forEach(([key, value], index) => {
        const bgColor = index % 2 === 0 ? secondaryColor : '#FFFFFF';
        doc.rect(50, y, 500, 20).fill(bgColor).strokeColor('#DDDDDD').stroke();
        doc.font(boldFont).fontSize(10).fillColor(textColor).text(key, 60, y + 5);
        doc.font(regularFont).fontSize(10).fillColor(textColor).text(value, 250, y + 5);
        y += 20;
      });
      y += 15;

      // DÉTAILS DU PAIEMENT
      doc.font(boldFont).fontSize(12).fillColor(primaryColor).text('DÉTAILS DU PAIEMENT', 50, y);
      y += 20;

      const paymentDetails = [
  ['Description', 'Montant'],
];

let totalMontant = 0;

if (consignationPayee) {
  const montantConsignation = Number(consignationPayee.montant) || 0;
  paymentDetails.push(['Consignation juridique', `${montantConsignation.toFixed(2)} DNT`]);
  totalMontant += montantConsignation;
}

if (saisiePayee) {
  const montantSaisie = Number(saisiePayee.montantSaisi) || 0;
  paymentDetails.push(['Saisie conservatoire', `${montantSaisie.toFixed(2)} DNT`]);
  totalMontant += montantSaisie;
}
      // Afficher tableau paiements
      paymentDetails.forEach((row, rowIndex) => {
        const isHeader = rowIndex === 0;
        const cellHeight = 25;
        doc.rect(50, y, 350, cellHeight).fill(isHeader ? primaryColor : (rowIndex % 2 === 0 ? secondaryColor : '#FFFFFF')).strokeColor('#DDDDDD').stroke();
        doc.rect(400, y, 150, cellHeight).fill(isHeader ? primaryColor : (rowIndex % 2 === 0 ? secondaryColor : '#FFFFFF')).strokeColor('#DDDDDD').stroke();
        doc.font(isHeader ? boldFont : regularFont).fontSize(10).fillColor(isHeader ? '#FFFFFF' : textColor).text(row[0], 60, y + 8);
        doc.font(isHeader ? boldFont : regularFont).fontSize(10).fillColor(isHeader ? '#FFFFFF' : textColor).text(row[1], 410, y + 8, { align: 'right' });
        y += cellHeight;
      });

      // Total
      y += 10;
      doc.rect(400, y, 150, 30).fill(secondaryColor).strokeColor('#DDDDDD').stroke();
      doc.font(boldFont).fontSize(12).fillColor(textColor).text('TOTAL', 410, y + 8);
      doc.font(boldFont).fontSize(12).fillColor(primaryColor).text(`${totalMontant.toFixed(2)} DNT`, 410, y + 8, { align: 'right' });
      y += 40;

      // INFORMATIONS AFFAIRE
      doc.font(boldFont).fontSize(12).fillColor(primaryColor).text('INFORMATIONS DE L\'AFFAIRE', 50, y);
      y += 20;

      const caseDetails = {
        'Numéro d\'affaire': affaire.numeroAffaire,
        'Objet': affaire.objet || 'Non spécifié',
        'Degré juridique': affaire.degreJuridique,
        'Type de réclamation': affaire.reclamation?.type || 'Non spécifié',
        'Date d\'ouverture': affaire.dateOuverture ? new Date(affaire.dateOuverture).toLocaleDateString('fr-FR') : 'Non spécifiée'
      };

      Object.entries(caseDetails).forEach(([key, value], index) => {
        const bgColor = index % 2 === 0 ? secondaryColor : '#FFFFFF';
        doc.rect(50, y, 500, 20).fill(bgColor).strokeColor('#DDDDDD').stroke();
        doc.font(boldFont).fontSize(10).fillColor(textColor).text(key, 60, y + 5);
        doc.font(regularFont).fontSize(10).fillColor(textColor).text(value, 250, y + 5);
        y += 20;
      });

      y += 30;

      // NOTES
      doc.font(boldFont).fontSize(10).fillColor(primaryColor).text('Notes:', 50, y);
      y += 15;
      doc.font(regularFont).fontSize(9).fillColor(lightText)
        .text('Cette facture est établie électroniquement et est valable sans signature.', 50, y, {
          width: 500,
          lineGap: 5
        });

      // PIED DE PAGE
      const footerY = doc.page.height - 50;
      doc.moveTo(50, footerY).lineTo(550, footerY).strokeColor('#EEEEEE').lineWidth(1).stroke();
      doc.font(regularFont).fontSize(8).fillColor(lightText)
        .text('Merci pour votre confiance', 50, footerY + 10, { align: 'center', width: 500 });
      doc.text(`Tunisair - Société Tunisienne de l'Air • Page ${doc.bufferedPageRange().count}`, 50, footerY + 25, { align: 'center', width: 500 });

      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', reject);

    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generatePaymentInvoice;
