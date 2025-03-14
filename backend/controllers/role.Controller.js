const Role=require('../models/Role.model');
const User=require('../models/User.model')


const roleController={};

roleController.createRole=async(req , res)=>{
    try{
        const{nom, description}=req.body;

        const existingRole=await Role.findOne({nom});
        if(existingRole){
            return res.status(400).json({message: "Role existe déja"})
        }
        const newRole= new Role({nom, description});
        await newRole.save();
        res.status(201).json({message:"Role crée avec succes !"})
    }catch(error){
        res.status(500).json({message:"Erreur lors de creation de role"});
    }
    
};

roleController.assignRoleToUser = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        // Vérification que les identifiants sont présents dans le corps de la requête
        if (!userId || !roleId) {
            return res.status(400).json({ message: "userId et roleId sont requis." });
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Vérifier si le rôle existe
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: "Rôle non trouvé." });
        }

        // Assigner le rôle à l'utilisateur
        user.role = roleId;
        await user.save();

        res.status(200).json({
            message: "Rôle assigné avec succès.",
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: role.nom // Affiche le nom du rôle assigné
            }
        });

    } catch (error) {
        console.error("Erreur lors de l'assignation du rôle:", error);  // Pour déboguer
        res.status(500).json({ message: "Erreur lors de l'assignation." });
    }
};

module.exports=roleController;