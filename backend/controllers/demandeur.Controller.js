const Demandeur=require('../models/Demandeur.model');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const uploadImage = require('../midelware/multer'); // Importer le middleware Multer

const demandeurController = {};

demandeurController.registerDemandeur = async (req, res) => {
    try {
        const { nom, prenom, email, password, phone,cin, matricule,ficheCarriere,contratTravail,decisionsPromotions } = req.body;

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà." });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Gestion de l'image de profil pour le client
        let imageprofile = '';
        if (req.file) {
            console.log('Image reçue:', req.file); // Vérifie le contenu du fichier

            // L'image est envoyée dans le dossier 'uploads', donc on peut générer l'URL correctement
            imageprofile = 'http://localhost:7501/uploads/' + req.file.filename; // URL vers l'image téléchargée
        } else {
            console.log('Aucune image reçue.');
        }

        // Créer un nouvel utilisateur avec l'image de profil
        const newUser = new User({
            nom,
            prenom,
            email,
            password: hashedPassword,
            phone,
            imageprofile ,
            isActive: false  // Enregistrer l'image de profil dans User
        });

        console.log('Nouvel utilisateur créé:', newUser); // Log pour vérifier l'objet utilisateur avant sauvegarde

        // Enregistrer l'utilisateur
        await newUser.save();

        // Créer un client en associant l'utilisateur créé
        const newDemandeur = new Demandeur({
            utilisateur: newUser._id,
            cin,
            matricule,
            ficheCarriere,
            contratTravail,
            decisionsPromotions

        });

        console.log('Nouveau Demandeur créé:', newDemandeur); // Log pour vérifier l'objet client avant sauvegarde

        // Enregistrer le client
        await newDemandeur.save();

        res.status(201).json({ message: "Demandeur inscrit avec succès !", user: newUser });
    } catch (error) {
        console.error("Erreur lors de l'inscription du demandeur:", error);
        res.status(500).json({ message: "Erreur lors de l'inscription du demandeur.", error });
    }
};

module.exports = demandeurController;
