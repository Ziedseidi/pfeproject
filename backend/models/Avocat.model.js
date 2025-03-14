const mongoose = require('mongoose');

const avocatSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
    adresse: { type: String, required: true },
    referenceConvention: { type: String },
    dateDebutConvention: { type: Date },
    dateFinConvention: { type: Date },
    region: { type: String },
    honoraires: { type: Number },
    affairesAttribuees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Affaire' , default:null }]  // Référence à 'Affaire'
}, { timestamps: true });

module.exports = mongoose.model('Avocat', avocatSchema);  // Le modèle est bien 'Avocat'
