const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avocatSchema = new Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adresse: { type: String, required: true },
    dateDebutConvention: { type: Date, default: null },
    dateFinConvention: { type: Date, default: null },
    region: { type: String },
    honoraires: { type: Number },
    affairesAttribuees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Affaire' }],

    degreJuridiction: {
        type: String,
        enum: ['Première Instance', 'Appel', 'Cassation'],
        default: 'Première Instance'
    },

    contrats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contrat' }] // tableau des contrats
}, { timestamps: true });

module.exports = mongoose.model('Avocat', avocatSchema);
