const mongoose = require('mongoose');
const audienceSchema = new mongoose.Schema({
    affaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Affaire', required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['préparatoire', 'jugement', 'autre'], default: 'autre' },
    observations: { type: String }
  });
  
  module.exports = mongoose.model('Audience', audienceSchema);
  