const mongoose = require('mongoose');

const consignationSchema = new mongoose.Schema({
    affaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Affaire', required: true },
    montant: { type: Number, required: true },
    // Définir `dateConsignation` avec une valeur par défaut de la date actuelle
    dateConsignation: { type: Date, required: true, default: Date.now },
    dateRecuperation: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Consignation', consignationSchema);
