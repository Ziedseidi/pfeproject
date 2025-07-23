// tests/authController.test.js

const authController = require('../controllers/auth.Controller');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/User.model'); // Mock du modèle User
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    test('devrait retourner 400 si email ou mot de passe manquant', async () => {
      req.body = { email: '', password: '' };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email et mot de passe requis." });
    });

    test('devrait retourner 401 si utilisateur non trouvé', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };

      // Mock findOne().populate() qui retourne null (utilisateur non trouvé)
      User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Email ou mot de passe incorrect." });
    });

    test('devrait retourner 403 si compte inactif', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };

      const mockUser = { isActive: false };

      User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Votre compte n'est pas encore activé." });
    });

    test('devrait retourner 401 si mot de passe incorrect', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };

      const mockUser = {
        isActive: true,
        password: 'hashedpassword',
        role: { nom: 'admin' },
        _id: 'userId',
        nom: 'Jean',
        prenom: 'Dupont',
        email: 'test@example.com',
        phone: '123456'
      };

      User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });

      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Email ou mot de passe incorrect." });
    });

    test('devrait retourner 200 avec token et infos utilisateur si connexion réussie', async () => {
      req.body = { email: 'jean.dupont@example.com', password: 'correctpassword' };

      const mockUser = {
        isActive: true,
        password: 'hashedpassword',
        role: { nom: 'admin' },
        _id: 'userId',
        nom: 'Jean',
        prenom: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '123456'
      };

      User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });

      bcrypt.compare.mockResolvedValue(true);

      jwt.sign.mockReturnValue('fake-jwt-token');

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Connexion réussie.",
        token: 'fake-jwt-token',
        user: {
          id: 'userId',
          nom: 'Jean',
          prenom: 'Dupont',
          email: 'jean.dupont@example.com',
          phone: '123456',
          role: 'admin'
        }
      });
    });
  });

  describe('logout', () => {
    test('devrait appeler clearCookie et retourner message succès', () => {
      authController.logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token', { path: '/' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Déconnexion réeussie" });
    });
  });

  describe('getUserInfo', () => {
    test('devrait retourner 404 si utilisateur non trouvé', async () => {
      req.user = { userId: 'userId' };

      User.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(null)
        })
      });

      await authController.getUserInfo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur non trouvé." });
    });

    test('devrait retourner infos utilisateur', async () => {
      req.user = { userId: 'userId' };

      const mockUser = {
        nom: 'Jean',
        prenom: 'Dupont',
        imageprofile: null,
        role: { nom: 'admin' }
      };

      User.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(mockUser)
        })
      });

      await authController.getUserInfo(req, res);

      expect(res.json).toHaveBeenCalledWith({
        nom: 'Jean',
        prenom: 'Dupont',
        imageprofile: 'assets/images/default-user.jpg',
        role: 'admin'
      });
    });
  });
});
