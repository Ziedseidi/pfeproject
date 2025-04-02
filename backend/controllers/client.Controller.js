const Client = require('../models/Client.model');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const uploadImage = require('../midelware/multer'); // Importer le middleware Multer

const clientController = {};

// Route pour l'inscription du client avec l'image de profil
clientController.registerClient = async (req, res) => {
    try {
        const { nom, prenom, email, password, phone } = req.body;

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
            // Vérification de la réception de l'image
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
        const newClient = new Client({
            utilisateur: newUser._id, // Référence à l'utilisateur créé
        });

        console.log('Nouveau client créé:', newClient); // Log pour vérifier l'objet client avant sauvegarde

        // Enregistrer le client
        await newClient.save();

        res.status(201).json({ message: "Client inscrit avec succès !", user: newUser });
    } catch (error) {
        console.error("Erreur lors de l'inscription du client:", error);
        res.status(500).json({ message: "Erreur lors de l'inscription du client.", error });
    }
};

module.exports = clientController;
