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
    
    // Nouveau champ pour le degré de juridiction
    degreJuridiction: {
        type: String,
        enum: ['Première Instance', 'Appel', 'Cassation'],
        default: 'Première Instance'
    }
}, { timestamps: true });

module.exports = mongoose.model('Avocat', avocatSchema);
