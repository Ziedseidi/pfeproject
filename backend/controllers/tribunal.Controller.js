const Tribunal = require('../models/Tribunal.model');
const uploadImage = require('../midelware/multer');

const tribunalController = {};
tribunalController.addTribunal = async (req, res) => {
    try {
      const { nom, adresse, ville, telephone, email, typeTribunal, etatTribunal } = req.body;
      let imagetribunal = '';
  
      if (req.file) {
        imagetribunal = 'http://localhost:7501/uploads/' + req.file.filename;
      }
  
      const newTribunal = new Tribunal({
        nom,
        adresse,
        ville,
        telephone,
        email,
        typeTribunal,
        etatTribunal: etatTribunal !== undefined ? etatTribunal : true,  // Par défaut en travail (true)
        imagetribunal: imagetribunal || '',  // Si aucune image, on envoie une chaîne vide
      });
  
      await newTribunal.save();
  
      res.status(201).json({ message: "Tribunal ajouté avec succès", tribunal: newTribunal });
    } catch (error) {
      console.log("Erreur lors de l'ajout du tribunal", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  tribunalController.getTribunauxClassifies =async(req,res)=>{
    try {
        const tribunaux = await Tribunal.find();
    
        const tribunauxClasse = {
          "Cour d'Appel": tribunaux.filter(tribunal => tribunal.typeTribunal === "Cour d'Appel"),
          "Première Instance": tribunaux.filter(tribunal => tribunal.typeTribunal === "Première Instance")
        };
    
        return res.json(tribunauxClasse);
      } catch (error) {
        console.error("Erreur lors de la récupération des tribunaux:", error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
      }
    };

    
  
module.exports = tribunalController;
