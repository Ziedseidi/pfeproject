const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avocatSchema = new Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adresse: { type: String, required: true },
    dateDebutConvention: { type: Date, default: null }, // Le champ est conservé, mais sera mis à jour lors de l'assignation
    dateFinConvention: { type: Date, default: null },
    region: { type: String },
    honoraires: { type: Number },
    affairesAttribuees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Affaire' }]
}, { timestamps: true });

module.exports = mongoose.model('Avocat', avocatSchema);
