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

  tribunalController.toggleAllTribunaux = async (req, res) => {
  try {
    // Vérifier l'état actuel : s'il existe au moins un tribunal actif
    const anyActive = await Tribunal.exists({ etatTribunal: true });

    // Définir le nouvel état : si au moins un actif, on désactive tous ; sinon on active tous
    const newState = !anyActive;

    // Mettre à jour tous les tribunaux
    await Tribunal.updateMany({}, { etatTribunal: newState });

    res.status(200).json({ 
      message: `Tous les tribunaux ont été ${newState ? 'activés' : 'désactivés'} avec succès`,
      etatGlobal: newState
    });
  } catch (error) {
    console.error('Erreur lors de la modification de l’état des tribunaux :', error);
    res.status(500).json({ message: 'Erreur serveur lors du toggle des tribunaux', error });
  }
};  
  
module.exports = tribunalController;
