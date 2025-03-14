const bcrypt=require('bcryptjs');
const User =require('../models/User.model');
const Expert= require('../models/Expert.model');

const expertController={};

expertController.registerexpert=async(req , res)=>{
    try{
        const { nom, prenom, email, password,phone,imageprofile ,adresse, dateExpertise, fraisExpertise } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
//  création d un new utilisateur
    const newUser = new User({ nom, prenom, email, password: hashedPassword ,phone,imageprofile});

    // Enregistrer l'utilisateur
    await newUser.save();

    const newExpert = new Expert({
        utilisateur: newUser._id, // Associe l'expert à l'utilisateur
        adresse,
        dateExpertise,
        fraisExpertise
    });

    await newExpert.save();

    res.status(201).json({ message: "Expert inscrit avec succès !", user: newUser });
} catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription.", error });
}
};

module.exports=expertController;