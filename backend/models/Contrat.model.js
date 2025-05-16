const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema({
    objet: { type: String, required: true },
    montant: { type: Number },
    direction: { type: String }, 
    dateSignature: { type: Date },
    dateEffet: { type: Date },
    duree: { type: String },
    dateFin: { type: Date },
    datePreavis: { type: Date },

    fichier: { type: String, default: null },
  demandeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Demandeur', required: true },

    avocat: { type: mongoose.Schema.Types.ObjectId, ref: 'Avocat', required: true }, 
    affaires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Affaire' }],
    etat: {
    type: String,
    enum: ['en attente', 'accepté', 'refusé'],
    default: 'en attente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Contrat', contratSchema);


