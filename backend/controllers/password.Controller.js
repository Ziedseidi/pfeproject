const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { sendMail } = require('../utils/sendEmail');

const passwordController = {};

// Demande de réinitialisation du mot de passe
passwordController.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Générer un token sécurisé
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Expiration dans 1 heure
        await user.save();

        // Lien de réinitialisation
        const resetURL = `http://localhost:7501/password/reset-password/${token}`;
        const emailContent = `
            <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le lien suivant pour le réinitialiser :</p>
            <a href="${resetURL}">${resetURL}</a>
            <p>Ce lien expirera dans 1 heure.</p>
        `;

        // Vérifier que l'email est défini
        if (!user.email) {
            return res.status(400).json({ message: 'Email manquant pour l\'utilisateur' });
        }

        // Envoyer l'email
        await sendMail(user.email, 'Réinitialisation du mot de passe', emailContent, true);

        res.status(200).json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Réinitialisation du mot de passe avec le token
passwordController.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
        }

        // Vérification de la complexité du mot de passe
        const passwordCriteria = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/;
        if (!passwordCriteria.test(newPassword)) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins 12 caractères, avec des chiffres, majuscules, minuscules et caractères spéciaux.'
            });
        }

        // Recherche de l'utilisateur avec un token valide
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        }).exec();

        if (!user) {
            return res.status(400).json({ message: 'Token invalide ou expiré' });
        }

        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = passwordController;
