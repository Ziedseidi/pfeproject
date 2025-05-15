const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dossierSchema = new Schema({
  numeroAffaire:{ type: String, required: true }, 
  titre: { type: String, required: true }, // Titre du dossier
  description: { type: String }, // Description du dossier
  avocat: { type: mongoose.Schema.Types.ObjectId, ref: 'Avocat', required: true }, 
  dateCreation: { type: Date, default: Date.now }, 
  imagesFichier: [String] 
}, { timestamps: true });

module.exports = mongoose.model('Dossier', dossierSchema);
