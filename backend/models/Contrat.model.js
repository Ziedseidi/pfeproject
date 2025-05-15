const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema({
    objet: { type: String, required: true },
    montant: { type: Number },
    direction: { type: String }, // (RH, Juridique, etc.)
    dateSignature: { type: Date },
    dateEffet: { type: Date },
    duree: { type: String },
    dateFin: { type: Date },
    datePreavis: { type: Date },

    fichier: { type: String, default: null },

    avocat: { type: mongoose.Schema.Types.ObjectId, ref: 'Avocat', required: true }, // un seul avocat
    affaires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Affaire' }]
}, { timestamps: true });

module.exports = mongoose.model('Contrat', contratSchema);
