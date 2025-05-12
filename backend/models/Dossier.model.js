const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dossierSchema = new Schema({
  numeroAffaire:{ type: String, required: true }, 
  titre: { type: String, required: true }, // Titre du dossier
  description: { type: String }, // Description du dossier
  avocat: { type: mongoose.Schema.Types.ObjectId, ref: 'Avocat', required: true }, // Référence à l'avocat
  dateCreation: { type: Date, default: Date.now }, // Date de création
  imagesFichier: [String] // Tableau des chemins des images du dossier
}, { timestamps: true });

module.exports = mongoose.model('Dossier', dossierSchema);
