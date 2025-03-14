const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        // Récupérer le token depuis les cookies ou le header Authorization
        let token = req.cookies.token || req.headers.authorization || req.headers.token;

        if (!token) {
            return res.status(401).json({ message: 'Authentification échouée : Aucun token fourni' });
        }

        // Si le token est sous format "Bearer <token>", on extrait la partie après "Bearer "
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }

        // Vérifier et décoder le token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        console.log('✅ Token décodé:', decodedToken);

        req.user = {
            userId: decodedToken.userId,
            role: decodedToken.role // Permet une vérification plus simple des rôles
        };

        next(); 
    } catch (error) {
        console.error('❌ Erreur lors de la vérification du token:', error.message);
        return res.status(401).json({ message: 'Authentification échouée : Token invalide ou expiré' });
    }
};

module.exports = authenticateToken;
