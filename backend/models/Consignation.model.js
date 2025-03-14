const mongoose = require('mongoose');

const consignationSchema = new mongoose.Schema({
    affaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Affaire', required: true },  // Référence à 'Affaire' est correcte
    montantConsignation: { type: Number, required: true },
    dateConsignation: { type: Date, required: true },
    dateRecuperation: { type: Date }  // Optionnel, donc pas nécessairement requis
}, { timestamps: true });  // Ajout de timestamps (createdAt, updatedAt)

module.exports = mongoose.model('Consignation', consignationSchema);  // Le modèle est bien 'Consignation'
