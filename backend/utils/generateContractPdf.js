const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const Avocat = require('../models/Avocat.model');
const Demandeur = require('../models/Demandeur.model');

const generateContractPdf = (contrat, avocatId, demandeurId, affaires, outputPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Configuration du document (UNE SEULE PAGE)
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
        bufferPages: false // Désactive le multi-page
      });

      // Création du dossier de sortie
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Récupération des données
      const [avocat, demandeurObj] = await Promise.all([
        Avocat.findById(avocatId).populate('utilisateur'),
        Demandeur.findById(demandeurId).populate('utilisateur')
      ]);
      const demandeur = demandeurObj?.utilisateur;

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Styles constants
      const primaryColor = '#1F4E79';
      const secondaryColor = '#E53935';
      const textColor = '#333333';
      const lightText = '#666666';

      // =============== EN-TÊTE ===============
      // Logo
      const logoPath = path.join(__dirname, '..', 'assets', 'Tunisair-logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 100 });
      }

      // Titre principal
      doc.font('Helvetica-Bold')
        .fontSize(18)
        .fillColor(primaryColor)
        .text('CONTRAT JURIDIQUE', 160, 60);

      // Ligne de séparation
      doc.moveTo(50, 90)
        .lineTo(550, 90)
        .strokeColor('#DDDDDD')
        .lineWidth(1)
        .stroke();

      // =============== CONTENU PRINCIPAL ===============
      let y = 110; // Position verticale initiale

      // Fonction pour vérifier l'espace disponible
      const checkSpace = (requiredHeight) => {
        if (y + requiredHeight > 650) { // 650 = limite avant le footer
          // Réduire les marges si nécessaire
          y -= 10;
          return false;
        }
        return true;
      };

      // 1. INFORMATIONS DU CONTRAT
      doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(primaryColor)
        .text('INFORMATIONS DU CONTRAT', 50, y);
      y += 20;

      const contractInfo = [
        { label: 'Objet', value: contrat.objet || 'Non spécifié' },
        { label: 'Montant', value: contrat.montant ? `${contrat.montant} DNT` : 'N/A' },
        { label: 'Direction', value: contrat.direction || 'N/A' },
        { label: 'Date signature', value: contrat.dateSignature?.toLocaleDateString('fr-FR') || 'N/A' },
        { label: 'Date effet', value: contrat.dateEffet?.toLocaleDateString('fr-FR') || 'N/A' },
        { label: 'Durée', value: contrat.duree || 'N/A' },
        { label: 'Date fin', value: contrat.dateFin?.toLocaleDateString('fr-FR') || 'N/A' },
        { label: 'Préavis', value: contrat.datePreavis?.toLocaleDateString('fr-FR') || 'N/A' }
      ];

      contractInfo.forEach(item => {
        if (!checkSpace(20)) return;
        
        doc.font('Helvetica')
          .fontSize(10)
          .fillColor(lightText)
          .text(`${item.label}:`, 50, y, { width: 150, continued: true })
          .fillColor(textColor)
          .text(item.value, { width: 350 });
        y += 20;
      });

      // 2. PARTIES CONTRACTANTES
      if (checkSpace(60)) {
        y += 10;
        doc.font('Helvetica-Bold')
          .fontSize(12)
          .fillColor(primaryColor)
          .text('PARTIES CONTRACTANTES', 50, y);
        y += 20;

        // Avocat
        doc.font('Helvetica-Bold')
          .fontSize(10)
          .fillColor(secondaryColor)
          .text('AVOCAT', 50, y);
        y += 15;

        const avocatInfo = [
          { label: 'Nom', value: `${avocat?.utilisateur.nom || ''} ${avocat?.utilisateur.prenom || ''}` },
          { label: 'Email', value: avocat?.utilisateur.email || 'N/A' },
          { label: 'Téléphone', value: avocat?.utilisateur.phone || 'N/A' }
        ];

        avocatInfo.forEach(item => {
          doc.font('Helvetica')
            .fontSize(10)
            .fillColor(lightText)
            .text(`${item.label}:`, 50, y, { width: 150, continued: true })
            .fillColor(textColor)
            .text(item.value, { width: 350 });
          y += 15;
        });

        // Demandeur
        y += 5;
        doc.font('Helvetica-Bold')
          .fontSize(10)
          .fillColor(secondaryColor)
          .text('PERSONNEL JURIDIQUE TUNISAIR', 50, y);
        y += 15;

        const demandeurInfo = [
          { label: 'Nom', value: `${demandeur?.nom || ''} ${demandeur?.prenom || ''}` },
          { label: 'Email', value: demandeur?.email || 'N/A' },
          { label: 'Téléphone', value: demandeur?.phone || 'N/A' }
        ];

        demandeurInfo.forEach(item => {
          doc.font('Helvetica')
            .fontSize(10)
            .fillColor(lightText)
            .text(`${item.label}:`, 50, y, { width: 150, continued: true })
            .fillColor(textColor)
            .text(item.value, { width: 350 });
          y += 15;
        });
      }

      // 3. AFFAIRES CONCERNÉES (si espace disponible)
      if (affaires?.length > 0 && checkSpace(100)) {
        y += 10;
        doc.font('Helvetica-Bold')
          .fontSize(12)
          .fillColor(primaryColor)
          .text('AFFAIRES CONCERNÉES', 50, y);
        y += 20;

        affaires.forEach((affaire, index) => {
          if (!checkSpace(50)) return;
          
          doc.font('Helvetica-Bold')
            .fontSize(10)
            .fillColor(textColor)
            .text(`Affaire n°${index + 1}: ${affaire.numeroAffaire}`, 50, y);
          y += 15;

          const affaireData = [
            { label: 'Objet', value: affaire.objet || 'Non spécifié' },
            { label: 'Degré juridique', value: affaire.degreJuridique || 'N/A' },
            { label: 'Date convocation', value: affaire.dateConvocation?.toLocaleDateString('fr-FR') || 'N/A' },
            { label: 'Tribunal', value: affaire.tribunal?.nom || 'N/A' }
          ];

          affaireData.forEach(item => {
            doc.font('Helvetica')
              .fontSize(9)
              .fillColor(lightText)
              .text(`  • ${item.label}:`, 60, y, { width: 150, continued: true })
              .fillColor(textColor)
              .text(item.value, { width: 350 });
            y += 12;
          });
          y += 10;
        });
      }

      // =============== SIGNATURES ===============
      // Ajustement si on est trop bas
      if (y > 600) y = 600; 

      const signatureY = y + 20;
      const signatureWidth = 200;

      // Signature Avocat
      doc.font('Helvetica')
        .fontSize(10)
        .fillColor(textColor)
        .text("Pour l'avocat mandaté", 100, signatureY, {
          width: signatureWidth,
          align: 'center'
        });

      doc.strokeColor('#AAAAAA')
        .lineWidth(1)
        .moveTo(100, signatureY + 20)
        .lineTo(300, signatureY + 20)
        .stroke();

      // Signature Demandeur
      doc.font('Helvetica')
        .fontSize(10)
        .fillColor(textColor)
        .text('Pour le service juridique Tunisair', 350, signatureY, {
          width: signatureWidth,
          align: 'center'
        });

      doc.strokeColor('#AAAAAA')
        .lineWidth(1)
        .moveTo(350, signatureY + 20)
        .lineTo(550, signatureY + 20)
        .stroke();

      // Date
      doc.font('Helvetica')
        .fontSize(10)
        .fillColor(textColor)
        .text(`Fait à Tunis, le ${new Date().toLocaleDateString('fr-FR')}`, {
          align: 'center',
          y: signatureY + 40
        });

      // =============== PIED DE PAGE FIXE ===============
      const footerY = 750; // Position fixe en bas de page
      const footerText = 'Centre Juridique Tunisair - Tél: (00216) 71 754 000 - Email: juridique@tunisair.com.tn';

      // Ligne de séparation
      doc.strokeColor('#EEEEEE')
        .lineWidth(1)
        .moveTo(50, footerY)
        .lineTo(550, footerY)
        .stroke();

      // Texte du footer
      doc.font('Helvetica')
        .fontSize(8)
        .fillColor(lightText)
        .text(footerText, 50, footerY + 5, {
          width: 500,
          align: 'center'
        });

      // Numéro de page
      doc.text('Page 1/1', doc.page.width - 100, footerY + 5, {
        width: 50,
        align: 'right'
      });

      // =============== FINALISATION ===============
      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateContractPdf;