const Tribunal= require('../models/Tribunal.model');
const uploadImage = require('../midelware/multer'); 

const tribunalController={};

tribunalController.aadTribunal= async(req,res)=>{
    try{
        const { nom , adresse, ville, telephone,email}=req.body;
        let imagetribunal='';
        if(req.file){
            imagetribunal='http://localhost:7501/uploads/' + req.file.filename;
        }
        const newTribunal= new Tribunal({
            nom, adresse, ville, telephone,email,
            Imagetribunal:imagetribunal
        });
        await newTribunal.save();
        res.status(201).json({message:"Tribunal ajouter avec sucees", tribunal:newTribunal});
    }catch(error){
        console.log("Erreur lors de l'ajout du triunal",error);
        res.status(500).json({message:"Erreur serveur"});
    }
};

module.exports=tribunalController;
