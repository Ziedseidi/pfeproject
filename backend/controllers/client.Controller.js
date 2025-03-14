const bcrypt=require('bcryptjs');
const User=require('../models/User.model');

const clientController={};

clientController.registerClient=async(req , res)=>{
    try{
        const{nom, prenom ,email, password,phone,imageprofile}=req.body;

        const existingClient=await User.findOne({email});
        if(existingClient){
            return res.status(400).json({message:"L'utilsateur existe déja."});
        }

        const hashedPassword=await bcrypt.hash(password, 10);
        const newClient= new User({
            nom,prenom,email, password:hashedPassword,phone,imageprofile

        });
        await newClient.save();
        res.status(201).json({message:"Utilisateur enregistré avec succés !"});
    }catch(error){
        res.status(500).json({message:"Erreur lors de l'inscription",error});
    }
};

module.exports=clientController;