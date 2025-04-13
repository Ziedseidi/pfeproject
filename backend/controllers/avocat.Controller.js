const Avocat = require('../models/Avocat.model');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const uploadImage = require('../midelware/multer'); // Importer le middleware Multer

const avocatController = {};

// Route pour l'inscription de l'avocat
avocatController.registerAvocat = async (req, res) => {
    try {
        const {
            nom,
            prenom,
            email,
            password,
            phone,
            adresse,
            honoraires,
            region,
            degreJuridiction // 🔸 Nouveau champ récupéré depuis le body
        } = req.body;

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
            imageprofile = 'http://localhost:7501/uploads/' + req.file.filename;
        }

        // Création du nouvel utilisateur
        const newUser = new User({
            nom,
            prenom,
            email,
            password: hashedPassword,
            phone,
            imageprofile,
            isActive: false
        });

        await newUser.save();

        // Création de l'avocat avec le degré de juridiction
        const newAvocat = new Avocat({
            utilisateur: newUser._id,
            adresse,
            honoraires,
            region,
            dateDebutConvention: null,
            dateFinConvention: null,
            degreJuridiction // 🔸 Ajout ici
        });

        await newAvocat.save();

        res.status(201).json({ message: "Avocat inscrit avec succès !", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription.", error });
    }
};


module.exports = avocatController;
