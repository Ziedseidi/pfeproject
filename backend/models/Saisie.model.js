const mongoose = require('mongoose');

const saisieSchema = new mongoose.Schema({
    affaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Affaire', required: true },
    objetsSaisis: { type: String },
    dateAudience: { type: Date },
    numeroSaisie: { type: String },
    nomAdverse: { type: String },
    numeroPV: { type: String },
    montantSaisi: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Saisie', saisieSchema);
