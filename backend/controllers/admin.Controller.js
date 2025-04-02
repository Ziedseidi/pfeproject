const User = require('../models/User.model');
const Avocat = require('../models/Avocat.model');
const Expert = require('../models/Expert.model');
const Client = require('../models/Client.model');

const adminController={};

adminController.deleteUser=async(req , res)=>{
    const {userId}= req.params
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message :'Utilisateur non trouver'});
        }
        await Avocat.findOneAndDelete({utilisateur : userId});
        await Expert.findOneAndDelete({utilisateur: userId});
        await Client.findOneAndDelete({utilisateur: userId});
        await User.findByIdAndDelete(userId);

        res.status(200).json({message: 'Utilisateur et ses données associées supprimés'})

    }catch (error){
        console.error("erreur lors de la suppresion", error);
        res.status(500).json({message:'erreur de server lors de l suppresion'})
    }
};
adminController.toggleUserActivation = async (req, res) => {
    const { userId } = req.params;
    try {
      // Rechercher l'utilisateur par son ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Inverser l'état de isActive
      user.isActive = !user.isActive;
      await user.save();
  
      const action = user.isActive ? 'activé' : 'désactivé';
      res.status(200).json({ message: `Utilisateur ${action} avec succès` });
    } catch (error) {
      console.error('Erreur lors de la modification de l\'état de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la modification de l\'état de l\'utilisateur' });
    }
  };

module.exports=adminController;