const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Corriger 'Utilisateur' en 'User'
    adresse: { type: String },
    dateExpertise: { type: Date, required: true },
    fraisExpertise: { type: Number, required: true },
    affaires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Affaire', default:null }]  // Référence à 'Affaire'
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);  // Le modèle est bien 'Expert'
