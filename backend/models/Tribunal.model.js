const mongoose = require('mongoose');

const tribunalSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  adresse: { type: String, required: true },
  ville: { type: String },
  telephone: { type: String },
  email: { type: String },
  typeTribunal: { type: String, enum: ['Cour d\'Appel', 'Première Instance'], required: true },
  etatTribunal: {
    type: Boolean,
    required: true, 
    default: true,  
  },
  imagetribunal: { type: String }, // Ajout du champ image pour stocker l'URL ou chemin de l'image
});

module.exports = mongoose.model('Tribunal', tribunalSchema);
