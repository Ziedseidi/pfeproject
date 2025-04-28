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

avocatController.getAllAvocatSorted=async(req,res)=>{
    try{
        const avocats = await Avocat.find()
        .populate('utilisateur')
        .exec();

        const getDegreOrder = (degre)=>{
            switch(degre){
                case 'Appel' : return 1;
                case 'Première Instance': return 2;
                case 'Cassasation' : return 3 ;
                default : return 4;
            }
        };
        const sortedAvocats = avocats.sort((a,b)=>{
            return getDegreOrder(a.degreJuridiction) - getDegreOrder(b.degreJuridiction);
        });
        const detailedAvocats = sortedAvocats.map(avocat => ({
            _id: avocat._id,
            adresse: avocat.adresse,
            dateDebutConvention: avocat.dateDebutConvention,
            dateFinConvention: avocat.dateFinConvention,
            region: avocat.region,
            honoraires: avocat.honoraires,
            degreJuridiction: avocat.degreJuridiction,
            affairesAttribuees: avocat.affairesAttribuees.length > 0 ? avocat.affairesAttribuees : null,
            utilisateur: avocat.utilisateur ? {
              _id: avocat.utilisateur._id,
              nom: avocat.utilisateur.nom,
              prenom: avocat.utilisateur.prenom,
              email: avocat.utilisateur.email,
              phone: avocat.utilisateur.phone,
              imageprofile: avocat.utilisateur.imageprofile
            } : null
          }));
      
          res.status(200).json(detailedAvocats);
      
        } catch (error) {
          console.error('Erreur lors de la récupération des avocats :', error);
          res.status(500).json({ message: 'Erreur lors de la récupération des avocats', error });
        }
    }
    







module.exports = avocatController;
