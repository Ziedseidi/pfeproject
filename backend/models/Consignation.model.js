const mongoose = require('mongoose');

const consignationSchema = new mongoose.Schema({
    affaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Affaire', required: true },
    montant: { type: Number, required: true },
    dateConsignation: { type: Date, required: true },
    dateRecuperation: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Consignation', consignationSchema);
