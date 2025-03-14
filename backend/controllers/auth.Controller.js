const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const authController = {};

authController.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'email et le mot de passe sont fournis
        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe requis." });
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email }).populate('role'); // On récupère aussi le rôle
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role ? user.role.nom : null }, // Retourner le rôle exact ou null si pas de rôle
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Expiration du token après 7 jours
        );

        // Répondre avec le token et les infos de l'utilisateur
        res.status(200).json({
            message: "Connexion réussie.",
            token,
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                phone: user.phone,
                role: user.role ? user.role.nom : "Aucun rôle assigné"
            }
        });

        console.log(token);
    } catch (error) {
        console.error("❌ Erreur lors de la connexion:", error);
        res.status(500).json({ message: "Erreur serveur. Veuillez réessayer plus tard." });
    }
};

module.exports = authController;
