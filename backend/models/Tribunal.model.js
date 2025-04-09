const mongoose = require('mongoose');
const tribunalSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    ville: { type: String },
    telephone: { type: String },
    email: { type: String },
    Imagetribunal: {type:String}
  });
  
  module.exports = mongoose.model('Tribunal', tribunalSchema);
  