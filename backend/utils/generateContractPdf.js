const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const Avocat = require('../models/Avocat.model');
const Demandeur = require('../models/Demandeur.model');

const generateContractPdf = (contrat, avocatId, demandeurId, affaires, outputPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });

      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const avocat = await Avocat.findById(avocatId).populate('utilisateur');
      const demandeurObj = await Demandeur.findById(demandeurId).populate('utilisateur');
      const demandeur = demandeurObj?.utilisateur;

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // === EN-TÊTE AVEC BACKGROUND ===
      const headerHeight = 120;
      const headerColor = '#1F4E79'; // Couleur de fond pour l'en-tête

      // Fond coloré
      doc.rect(0, 0, doc.page.width, headerHeight).fill(headerColor);

      // Logo
      const logoPath = path.join(__dirname, '..', 'assets', 'Tunisair-logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 40, { width: 120 }); // position et taille du logo
      }

      // Titre
      doc.fontSize(20)
        .fillColor('#FFFFFF') // Texte en blanc
        .text('CONTRAT JURIDIQUE', 200, 50, { align: 'center', underline: true });

      doc.moveDown(3);

      // === INFOS CONTRAT ===
      doc.fontSize(14).fillColor('#1F4E79').text('1. Informations sur le contrat', { underline: true });
      doc.fontSize(12).fillColor('black');
      doc.text(`Objet : ${contrat.objet}`, { continued: true }).text(`Montant : ${contrat.montant ?? 'N/A'} DNT`, { align: 'right' });

      doc.text(`Direction : ${contrat.direction ?? 'N/A'}`, { continued: true }).text(`Date signature : ${contrat.dateSignature?.toLocaleDateString() ?? 'N/A'}`, { align: 'right' });

      doc.text(`Date effet : ${contrat.dateEffet?.toLocaleDateString() ?? 'N/A'}`, { continued: true }).text(`Durée : ${contrat.duree ?? 'N/A'}`, { align: 'right' });

      doc.text(`Date fin : ${contrat.dateFin?.toLocaleDateString() ?? 'N/A'}`, { continued: true }).text(`Préavis : ${contrat.datePreavis?.toLocaleDateString() ?? 'N/A'}`, { align: 'right' });
      doc.moveDown(2);

      // === INFOS AVOCAT ===
      doc.fontSize(14).fillColor('#1F4E79').text('2. Avocat', { underline: true });

      // Colonnes pour Avocat
      doc.fontSize(12).fillColor('black');

      // Colonne gauche – Nom
      doc.text(`Nom : ${avocat?.utilisateur.nom} ${avocat?.utilisateur.prenom}`, { continued: true }).text(`Email : ${avocat?.utilisateur.email}`, { align: 'right' });

      // Colonne droite – Téléphone
      doc.text(`Téléphone : ${avocat?.utilisateur.phone}`, { continued: true }).text('Adresse : N/A', { align: 'right' });
      doc.moveDown(2);

      // === INFOS DEMANDEUR ===
      doc.fontSize(14).fillColor('#1F4E79').text('3. Demandeur', { underline: true });

      // Colonnes pour Demandeur
      doc.fontSize(12).fillColor('black');

      // Colonne gauche – Nom
      doc.text(`Nom : ${demandeur?.nom} ${demandeur?.prenom}`, { continued: true }).text(`Email : ${demandeur?.email}`, { align: 'right' });

      // Colonne droite – Téléphone
      doc.text(`Téléphone : ${demandeur?.phone}`, { continued: true }).text('Adresse : N/A', { align: 'right' });
      doc.moveDown(2);

      // === AFFAIRES ===
      if (affaires.length > 0) {
        doc.fontSize(14).fillColor('#1F4E79').text('4. Affaires concernées', { underline: true });
        affaires.forEach((affaire, index) => {
          doc.fontSize(12).fillColor('black')
            .text(`• ${index + 1}) Numéro : ${affaire.numeroAffaire} | Objet : ${affaire.objet}`);
        });
      }

      // === SIGNATURES ===
      const signatureY = doc.y + 20;

      // Ligne de signature Avocat à gauche
      doc.strokeColor('#000').lineWidth(1)
        .moveTo(80, signatureY).lineTo(250, signatureY).stroke();
      doc.text("Signature de l'Avocat", 80, signatureY + 5, { align: 'left' });

      // Ligne de signature Demandeur à droite
      doc.moveTo(330, signatureY).lineTo(500, signatureY).stroke();
      doc.text('Signature du Personel Juridique', 330, signatureY + 5, { align: 'left' });

      doc.moveDown(2);

      // === FOOTER ===
      doc.fontSize(10).fillColor('#999').text('Centre juridique Tunisair - contacter nous : Tél: (00216) 71 754 000 ', { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateContractPdf;
