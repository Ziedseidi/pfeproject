const Avocat = require('../models/Avocat.model');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const uploadImage = require('../midelware/multer'); // Importer le middleware Multer

const avocatController = {};

// Route pour l'inscription de l'avocat
avocatController.registerAvocat = async (req, res) => {
    try {
        const { nom, prenom, email, password, phone, adresse, honoraires, region, referenceConvention, dateDebutConvention, dateFinConvention } = req.body;

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà." });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Gestion de l'image de profil
        let imageprofile = '';
        if (req.file) {
            imageprofile = 'http://localhost:7501/uploads/' + req.file.filename; // Le chemin vers l'image
        }

        // Créer un nouvel utilisateur avec l'image de profil
        const newUser = new User({
            nom,
            prenom,
            email,
            password: hashedPassword,
            phone,
            imageprofile  // Ajout de l'image de profil dans l'utilisateur
        });

        // Enregistrer l'utilisateur
        await newUser.save();

        // Créer un avocat avec les informations spécifiques
        const newAvocat = new Avocat({
            utilisateur: newUser._id,  // Référence à l'utilisateur créé
            adresse,
            honoraires,
            region,
            referenceConvention,
            dateDebutConvention,
            dateFinConvention
        });

        // Enregistrer l'avocat
        await newAvocat.save();

        res.status(201).json({ message: "Avocat inscrit avec succès !", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription.", error });
    }
};

module.exports = avocatController;
