const mongoose=require('mongoose');

const clientSchemas= new mongoose.Schema({
        utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
},{ timestamps: true });

module.exports=mongoose.model('Client',clientSchemas);