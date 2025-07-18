const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Affaire = require('../models/Affaire.model');
const Consignation = require('../models/Consignation.model');
const Saisie = require('../models/Saisie.model');

/**
 * Génère une facture PDF élégante pour un paiement
 * @param {'consignation'|'saisie'} type
 * @param {string} paiementId
 * @param {string} outputPath
 * @returns {Promise<void>}
 */
const generatePaymentInvoice = async (type, paiementId, outputPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      let paiementDoc = null;

      if (type === 'consignation') {
        paiementDoc = await Consignation.findById(paiementId).populate('affaire');
      } else if (type === 'saisie') {
        paiementDoc = await Saisie.findById(paiementId).populate('affaire');
      } else {
        return reject(new Error('Type de paiement invalide'));
      }

      if (!paiementDoc) {
        return reject(new Error(`${type} non trouvé.`));
      }

      if (paiementDoc.paymentStatus !== 'paid') {
        return reject(new Error('Le paiement est impayé. Impossible de générer la facture.'));
      }

      // Création du dossier de sortie
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Initialisation PDF avec des marges plus larges
      const doc = new PDFDocument({ 
        margin: 30,
        size: 'A4',
        bufferPages: true,
        layout: 'portrait'
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Couleurs du thème
      const primaryColor = '#1F4E79'; // Bleu Tunisair
      const secondaryColor = '#E6EFF7';
      const accentColor = '#F7931E'; // Orange
      const textColor = '#333333';
      const lightText = '#777777';

      // Police de caractères (Helvetica par défaut)
      const boldFont = 'Helvetica-Bold';
      const regularFont = 'Helvetica';

      // ==================== EN-TÊTE ====================
      const logoPath = path.join(__dirname, '..', 'assets', 'Tunisair-logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 30, { width: 100 });
      }

      // Titre principal
      doc.font(boldFont)
         .fontSize(24)
         .fillColor(primaryColor)
         .text('FACTURE', 400, 40, { align: 'right' });

      // Informations de la société
      doc.font(regularFont)
         .fontSize(9)
         .fillColor(lightText)
         .text('Tunisair - Société Tunisienne de l\'Air', 400, 65, { align: 'right' })
         .text('Centre Juridique', 400, 80, { align: 'right' })
         .text('Aéroport International de Tunis-Carthage', 400, 95, { align: 'right' })
         .text('Tél: (00216) 71 754 000', 400, 110, { align: 'right' })
         .text('Email: juridique@tunisair.com.tn', 400, 125, { align: 'right' });

      // Ligne de séparation
      doc.moveTo(50, 150)
         .lineTo(550, 150)
         .strokeColor(primaryColor)
         .lineWidth(1)
         .stroke();

      // ==================== INFORMATIONS DE LA FACTURE ====================
      let y = 170;

      // Tableau des informations de facturation
      const invoiceInfo = {
        'N° Facture': `TUN-${type.slice(0, 3).toUpperCase()}-${paiementId.toString().slice(-6)}`,
        'Date': new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        'Type de paiement': type === 'consignation' ? 'Consignation' : 'Saisie',
        'Statut': 'Payé'
      };

      // Dessiner le tableau
      doc.font(boldFont).fontSize(12).fillColor(primaryColor).text('INFORMATIONS DE LA FACTURE', 50, y);
      y += 20;

      // Dessiner le tableau avec fond alterné
      Object.entries(invoiceInfo).forEach(([key, value], index) => {
        const bgColor = index % 2 === 0 ? secondaryColor : '#FFFFFF';
        
        doc.rect(50, y, 500, 20)
           .fill(bgColor)
           .strokeColor('#DDDDDD')
           .stroke();
        
        doc.font(boldFont).fontSize(10).fillColor(textColor).text(key, 60, y + 5);
        doc.font(regularFont).fontSize(10).fillColor(textColor).text(value, 250, y + 5);
        
        y += 20;
      });

      y += 15;

      // ==================== DÉTAILS DU PAIEMENT ====================
      doc.font(boldFont).fontSize(12).fillColor(primaryColor).text('DÉTAILS DU PAIEMENT', 50, y);
      y += 20;

      const paymentDetails = [
        ['Description', 'Montant'],
        [type === 'consignation' ? 'Consignation juridique' : 'Saisie conservatoire', 
         `${type === 'consignation' ? paiementDoc.montant : paiementDoc.montantSaisi} EUR`]
      ];

      // Dessiner le tableau des détails
      paymentDetails.forEach((row, rowIndex) => {
        const isHeader = rowIndex === 0;
        const cellHeight = 25;
        
        doc.rect(50, y, 350, cellHeight)
           .fill(isHeader ? primaryColor : (rowIndex % 2 === 0 ? secondaryColor : '#FFFFFF'))
           .strokeColor('#DDDDDD')
           .stroke();
        
        doc.rect(400, y, 150, cellHeight)
           .fill(isHeader ? primaryColor : (rowIndex % 2 === 0 ? secondaryColor : '#FFFFFF'))
           .strokeColor('#DDDDDD')
           .stroke();
        
        doc.font(isHeader ? boldFont : regularFont)
           .fontSize(10)
           .fillColor(isHeader ? '#FFFFFF' : textColor)
           .text(row[0], 60, y + 8);
        
        doc.font(isHeader ? boldFont : regularFont)
           .fontSize(10)
           .fillColor(isHeader ? '#FFFFFF' : textColor)
           .text(row[1], 410, y + 8, { align: 'right' });
        
        y += cellHeight;
      });

      // Total
      y += 10;
      doc.rect(400, y, 150, 30)
         .fill(secondaryColor)
         .strokeColor('#DDDDDD')
         .stroke();
      
      doc.font(boldFont)
         .fontSize(12)
         .fillColor(textColor)
         .text('TOTAL', 410, y + 8);
      
      doc.font(boldFont)
         .fontSize(12)
         .fillColor(primaryColor)
         .text(`${type === 'consignation' ? paiementDoc.montant : paiementDoc.montantSaisi} EUR`, 410, y + 8, { align: 'right' });

      y += 40;

      // ==================== INFORMATIONS DE L'AFFAIRE ====================
      const affaire = paiementDoc.affaire;
      doc.font(boldFont).fontSize(12).fillColor(primaryColor).text('INFORMATIONS DE L\'AFFAIRE', 50, y);
      y += 20;

      const caseDetails = {
        'Numéro d\'affaire': affaire.numeroAffaire,
        'Objet': affaire.objet || 'Non spécifié',
        'Degré juridique': affaire.degreJuridique,
        'Type de réclamation': affaire.reclamation?.type || 'Non spécifié',
        'Date d\'ouverture': affaire.dateOuverture ? new Date(affaire.dateOuverture).toLocaleDateString('fr-FR') : 'Non spécifiée'
      };

      // Dessiner le tableau des détails de l'affaire
      Object.entries(caseDetails).forEach(([key, value], index) => {
        const bgColor = index % 2 === 0 ? secondaryColor : '#FFFFFF';
        
        doc.rect(50, y, 500, 20)
           .fill(bgColor)
           .strokeColor('#DDDDDD')
           .stroke();
        
        doc.font(boldFont).fontSize(10).fillColor(textColor).text(key, 60, y + 5);
        doc.font(regularFont).fontSize(10).fillColor(textColor).text(value, 250, y + 5);
        
        y += 20;
      });

      y += 30;

      // ==================== NOTES ====================
      doc.font(boldFont).fontSize(10).fillColor(primaryColor).text('Notes:', 50, y);
      y += 15;
      doc.font(regularFont).fontSize(9).fillColor(lightText)
         .text('Cette facture est établie électroniquement et est valable sans signature.', 50, y, {
           width: 500,
           lineGap: 5
         });

      // ==================== PIED DE PAGE ====================
      const footerY = doc.page.height - 50;
      
      doc.moveTo(50, footerY)
         .lineTo(550, footerY)
         .strokeColor('#EEEEEE')
         .lineWidth(1)
         .stroke();
      
      doc.font(regularFont)
         .fontSize(8)
         .fillColor(lightText)
         .text('Merci pour votre confiance', 50, footerY + 10, { align: 'center', width: 500 });
      
      doc.text(`Tunisair - Société Tunisienne de l'Air • Page ${doc.bufferedPageRange().count}`, 
               50, footerY + 25, { align: 'center', width: 500 });

      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', reject);

    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generatePaymentInvoice;