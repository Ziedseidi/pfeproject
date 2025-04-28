// models/Affaire.model.js
const mongoose = require('mongoose');

const affaireSchema = new mongoose.Schema({
  numeroAffaire: { type: String, required: true },
  objet: { type: String, default: null },

  avocat:    { type: mongoose.Schema.Types.ObjectId, ref: 'Avocat',    default: null },
  tribunal:  { type: mongoose.Schema.Types.ObjectId, ref: 'Tribunal',  default: null },

  dateConvocation:    { type: Date, default: null },
  degreJuridique: {
    type: String,
    enum: ['1er degré', '2ème degré', '3ème degré'],
    required: true
  },
  dateCloture:        { type: Date, default: null },
  clotureApresReception: { type: Boolean, default: false },
  remarques:          { type: String, default: null },

  reclamation: {
    type: {
      type: String,
      enum: ['retard', 'annulation', 'autre'],
      required: true
    },
  },

  experts:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expert'      }],
  consignations:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Consignation'}],
  saisies:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Saisie'      }],

  typeClient: {
    type: String,
    enum: ['fournisseur', 'assurance', 'passager', 'employe'],
    required: true
  },
  demandeur: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Demandeur',
    required: true 
  },

  numeroVol: { type: String, default: null },
  dateVol:   { type: Date,   default: null },

  referenceConvention: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Affaire', affaireSchema);
