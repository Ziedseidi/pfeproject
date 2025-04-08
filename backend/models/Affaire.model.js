const mongoose = require('mongoose');

const affaireSchema = new mongoose.Schema({
  numeroAffaire: { type: String, required: true },
  objet: { type: String },
  
  avocat: { type: mongoose.Schema.Types.ObjectId, ref: 'Avocat', default: null },  // Par défaut null
  tribunalAdresse: { type: String },
  dateConvocation: { type: Date },
  dateAudience: { type: Date },
  dateJugement: { type: Date },
  issue: { type: String },
  degreJuridiction: { type: String },
  dateCloture: { type: Date },
  clotureApresReception: { type: Boolean },
  montantJugement: { type: Number },
  remarques: { type: String },

  reclamation: {
    type: { 
      type: String, 
      enum: ['retard', 'annulation', 'autre'],  
      required: true
    },
    montant: { type: Number },  
    dateReception: { type: Date }  
  },

  experts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expert', default: null }],
  consignations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consignation', default: null }],
  saisies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Saisie', default: null }],

  typeDemandeur: {
    type: String,
    enum: ['fournisseur', 'assurance', 'passager', 'employe'],
    required: true
  },
  demandeur: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Demandeur',  // Référence au modèle Demandeur
    required: true
  },

  numeroVol: { type: String, default: null },
  dateVol: { type: Date, default: null },

}, { timestamps: true });

module.exports = mongoose.model('Affaire', affaireSchema);
