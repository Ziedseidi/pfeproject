const mongoose = require('mongoose');

const affaireSchema = new mongoose.Schema({
  numeroAffaire: { type: String, required: true },
  objet: { type: String },
  avocat: { type: mongoose.Schema.Types.ObjectId, ref: 'Avocat', default: null }, 
  tribunal: { type: mongoose.Schema.Types.ObjectId, ref: 'Tribunal', default : null},
  dateConvocation: { type: Date, default:null },
  audiences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audience' }],
  degreJuridiction: { type: String ,default : null},
  dateCloture: { type: Date ,default : null },
  clotureApresReception: { type: Boolean },
  remarques: { type: String , default:null },

  reclamation: {
    type: { 
      type: String, 
      enum: ['retard', 'annulation', 'autre'],  
      required: true
    },
    montant: { type: Number , default :null },  
    dateReception: { type: Date, default:null }  
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
    ref: 'Demandeur', 
    required: true
  },

  numeroVol: { type: String},
  dateVol: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('Affaire', affaireSchema);
