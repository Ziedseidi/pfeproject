const mongoose = require('mongoose');

const jugementSchema = new mongoose.Schema({
  dateJugement: { type: Date, required: true, default: Date.now },
  montant: { type: Number, required: true },
  issue: { type: String, required: true },
  remarques: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Jugement', jugementSchema);
