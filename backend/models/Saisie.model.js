const mongoose = require('mongoose');

const saisieSchema = new mongoose.Schema({
    affaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Affaire', required: true },
    objetsSaisis: { type: String, required: true },
    dateAudienceSaisie: { type: Date, required: true },
    numeroSaisie: { type: String, required: true, unique: true },
    nomPrenomAdverse: { type: String },
    avocats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Avocat' }],
    huissierJustice: { type: String },
    numeroPVSaisie: { type: String },
    montantSaisi: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Saisie', saisieSchema);