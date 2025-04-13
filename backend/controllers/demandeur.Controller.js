const Demandeur = require('../models/Demandeur.model');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const uploadImage = require('../midelware/multer'); // Importer le middleware Multer

const demandeurController = {};

demandeurController.registerDemandeur = async (req, res) => {
    try {
        const { nom, prenom, email, password, phone, cin, matricule, ficheCarriere, decisionsPromotions } = req.body;

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà." });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Gestion de l'image de profil
        let imageprofile = '';
        if (req.files && req.files.imageprofile) {
            console.log('Image reçue:', req.files.imageprofile); // Vérifie le contenu du fichier
            imageprofile = 'http://localhost:7501/uploads/' + req.files.imageprofile[0].filename;
        }

        // Gestion du contrat de travail
        let contratTravail = '';
        if (req.files && req.files.contratTravail) {
            console.log('Contrat de travail reçu:', req.files.contratTravail);
            contratTravail = 'http://localhost:7501/uploads/' + req.files.contratTravail[0].filename;
        }

        // Créer un nouvel utilisateur avec l'image de profil
        const newUser = new User({
            nom,
            prenom,
            email,
            password: hashedPassword,
            phone,
            imageprofile,
            isActive: false  // Enregistrer l'image de profil dans User
        });

        console.log('Nouvel utilisateur créé:', newUser);

        // Enregistrer l'utilisateur
        await newUser.save();

        // Créer un demandeur en associant l'utilisateur créé
        const newDemandeur = new Demandeur({
            utilisateur: newUser._id,
            cin,
            matricule,
            ficheCarriere,
            contratTravail,
            decisionsPromotions
        });

        console.log('Nouveau Demandeur créé:', newDemandeur);

        // Enregistrer le demandeur
        await newDemandeur.save();

        res.status(201).json({ message: "Demandeur inscrit avec succès !", user: newUser });
    } catch (error) {
        console.error("Erreur lors de l'inscription du demandeur:", error);
        res.status(500).json({ message: "Erreur lors de l'inscription du demandeur.", error });
    }
};

module.exports = demandeurController;
