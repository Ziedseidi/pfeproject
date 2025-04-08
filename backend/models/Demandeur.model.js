const mongoose = require('mongoose');

const demandeurSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cin: { type: String },
    matricule: { type: String },
    ficheCarriere: { type: String },
    contratTravail: { type: String },
    decisionsPromotions: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Demandeur', demandeurSchema);
