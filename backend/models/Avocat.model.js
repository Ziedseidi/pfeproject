const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avocatSchema = new Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Référence à un utilisateur
    adresse: { type: String, required: true },
    referenceConvention: { type: String },
    dateDebutConvention: { type: Date },
    dateFinConvention: { type: Date },
    region: { type: String },
    honoraires: { type: Number },
    affairesAttribuees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Affaire' }]  // Liste des affaires de l'avocat
}, { timestamps: true });

module.exports = mongoose.model('Avocat', avocatSchema);
