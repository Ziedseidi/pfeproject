const mongoose = require('mongoose');

const jugementSchema = new mongoose.Schema({
    affaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Affaire' },
    date: { type: Date },
    montant: { type: Number },
    issue: { type: String },
    remarques: { type: String }
  });
  
  module.exports = mongoose.model('Jugement', jugementSchema);
  