const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Expert = require('../models/Expert.model');

const expertController = {};

// Route pour l'inscription de l'expert avec l'image de profil
expertController.registerexpert = async (req, res) => {
    try {
        const { nom, prenom, email, password, phone, adresse, dateExpertise, fraisExpertise } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà." });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Gestion de l'image de profil
        let imageprofile = '';
        if (req.file) {
            imageprofile = 'http://localhost:7501/uploads/' + req.file.filename; // URL de l'image
        }

        // Créer un nouvel utilisateur avec l'image de profil
        const newUser = new User({
            nom,
            prenom,
            email,
            password: hashedPassword,
            phone,
            imageprofile  // Ajout de l'image de profil ici
        });

        // Enregistrer l'utilisateur
        await newUser.save();

        // Créer un expert et l'associer à l'utilisateur
        const newExpert = new Expert({
            utilisateur: newUser._id,  // Référence à l'utilisateur
            adresse,
            dateExpertise,
            fraisExpertise
        });

        // Enregistrer l'expert
        await newExpert.save();

        res.status(201).json({ message: "Expert inscrit avec succès !", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription de l'expert.", error });
    }
};

module.exports = expertController;
