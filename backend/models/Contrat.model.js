const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema({
    objetContrat: { type: String, required: true },
    partieContractante: { type: String, required: true },
    montant: { type: Number, required: true },
    direction: { type: String },
    dateSignature: { type: Date, required: true },
    dateEffet: { type: Date },
    duree: { type: Number },
    dateFin: { type: Date },
    preavis: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Contrat', contratSchema);