const mongoose = require('mongoose');

const affaireSchema = new mongoose.Schema({
    demandeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Corriger 'Utilisateur' en 'User'
    numeroAffaire: { type: String, required: true, unique: true },
    dateConvocation: { type: Date },
    adresseTribunal: { type: String },
    objetAffaire: { type: String },
    avocatCharge: { type: mongoose.Schema.Types.ObjectId, ref: 'Avocat' },
    issueAffaire: { type: String },
    degréJuridiction: { type: String },
    dateAudience: { type: Date },
    dateJugement: { type: Date },
    dateRecuperation: { type: Date },
    dateClotureDossier: { type: Date },
    numeroVol: { type: String },
    dateVol: { type: Date },
    dateReceptionReclamation: { type: Date },
    typeReclamation: { type: String, enum: ['Retard', 'Annulation', 'Autre'] },
    montantReclamé: { type: Number },
    montantJugement: { type: Number },
    expertises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expert' }],
    consignations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consignation' }],
    saisies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Saisie' }]
}, { timestamps: true });

module.exports = mongoose.model('Affaire', affaireSchema);  // Le modèle est bien 'Affaire'
