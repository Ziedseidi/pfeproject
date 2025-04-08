const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema({
    objet: { type: String, required: true },
    partieContractante: { type: String, required: true },
    montant: { type: Number },
    direction: { type: String },
    dateSignature: { type: Date },
    dateEffet: { type: Date },
    duree: { type: String },
    dateFin: { type: Date },
    datePreavis: { type: Date },
    fichier: { type: String } // PDF upload
}, { timestamps: true });

module.exports = mongoose.model('Contrat', contratSchema);
