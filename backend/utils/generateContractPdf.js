const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const Avocat = require('../models/Avocat.model');  // Importer le modèle Avocat
const User = require('../models/User.model');  // Importer le modèle User

const generateContractPdf = (contrat, avocatId, demandeurId, affaires, outputPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();

      // Vérifie si le dossier pdfs existe, sinon le crée
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Récupérer les informations de l'avocat et du demandeur
      const avocat = await Avocat.findById(avocatId).populate('utilisateur');  // Peupler l'utilisateur (avocat)
      const demandeur = await User.findById(demandeurId);  // Récupérer directement l'utilisateur (demandeur)

      // Crée un flux de sortie pour le fichier PDF
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Rédige le contenu du PDF
      doc.fontSize(20).text('DOCUMENT DE CONTRAT', { align: 'center' });
      doc.moveDown(1);

      doc.fontSize(12).text(`Objet du contrat : ${contrat.objet}`);
      doc.text(`Montant : ${contrat.montant ?? 'N/A'} DA`);
      doc.text(`Direction : ${contrat.direction ?? 'N/A'}`);
      doc.text(`Date de signature : ${contrat.dateSignature?.toLocaleDateString() ?? 'N/A'}`);
      doc.text(`Date d'effet : ${contrat.dateEffet?.toLocaleDateString() ?? 'N/A'}`);
      doc.text(`Durée : ${contrat.duree ?? 'N/A'}`);
      doc.text(`Date de fin : ${contrat.dateFin?.toLocaleDateString() ?? 'N/A'}`);
      doc.text(`Date de préavis : ${contrat.datePreavis?.toLocaleDateString() ?? 'N/A'}`);
      doc.moveDown(1);

      // Informations sur l'Avocat
      doc.fontSize(14).text('Informations sur l\'Avocat :');
      if (avocat && avocat.utilisateur) {
        doc.fontSize(12).text(`Nom : ${avocat.utilisateur.nom} ${avocat.utilisateur.prenom}`);
        doc.fontSize(12).text(`Email : ${avocat.utilisateur.email}`);
        doc.fontSize(12).text(`Phone : ${avocat.utilisateur.phone}`);
      }
      doc.moveDown(0.5);

      // Informations sur le Demandeur
      doc.fontSize(14).text('Informations sur le Demandeur :');
      if (demandeur) {
        doc.fontSize(12).text(`Nom : ${demandeur.nom} ${demandeur.prenom}`);
        doc.fontSize(12).text(`Email : ${demandeur.email}`);
        doc.fontSize(12).text(`Phone : ${demandeur.phone}`);
      }
      doc.moveDown(0.5);

      if (affaires.length > 0) {
        doc.fontSize(14).text('Affaires concernées :');
        affaires.forEach((affaire, index) => {
          doc.fontSize(12).text(`• ${index + 1}) Numéro : ${affaire.numeroAffaire} | Titre : ${affaire.objet}`);
        });
      }

      // Termine le document
      doc.end();

      // Lorsque le flux est terminé, on résout la promesse
      stream.on('finish', () => resolve());
      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateContractPdf;
