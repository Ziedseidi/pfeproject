const mongoose = require('mongoose');

const jugementSchema = new mongoose.Schema({
  affaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Affaire', required: true },
  date: { type: Date, required: true },
  montant: { type: Number, required: true },
  issue: { type: String, required: true },
  remarques: { type: String },
  saisiePar: { type: mongoose.Schema.Types.ObjectId, ref: 'Demandeur', required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Jugement', jugementSchema);
