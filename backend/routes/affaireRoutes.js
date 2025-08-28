const express = require('express');
const router=express.Router();
const affaireController=require('../controllers/affaire.Controller');
const roleMiddleware =require('../midelware/rbac');
const authenticateToken=require('../midelware/auth');



router.post('/add_Affaire',authenticateToken, roleMiddleware('PersonelJurédique'), affaireController.addAffaire);
router.post('/assign_avocat',authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.assignAvocatToAffaire);
router.get('/allAffaires',authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.getAllAffaires);
router.get('/avocats-eligibles/:affaireId', authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.getAvocatsEligibles);
router.post('/assign-tribunal',authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.assignTribunalToAffaire);
router.get('/rechercheAffaire/:numeroAffaire',authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.searchAffaire);
router.get('/compatibles/:affaireId',authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.getTribunauxCompatible);
router.post('/assign-consignation',authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.assigneConsignation);
router.post('/assign-saisie',authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.assigneSaisie);
router.get('/mes-affaires',authenticateToken,roleMiddleware('Avocat'),affaireController.getAffairesByAvocat);
router.post('/assign-jugement',authenticateToken,roleMiddleware('PersonelJurédique'),affaireController.assigneJugement);
router.get('/degre-juridique',authenticateToken,roleMiddleware('Admin'),affaireController.countByDegreJuridique);
router.get('/count-by-degre-avec-affaires',authenticateToken,roleMiddleware('Admin'),affaireController.countAvocatsByDegreWithAffaires);
router.get('/payments',authenticateToken,roleMiddleware('Admin'),affaireController.getPaymentStatistics);
router.get('/typeClient',authenticateToken,roleMiddleware('Admin'),affaireController.getAffairesCountByTypeClient);
router.get('/statutAffaire',authenticateToken,roleMiddleware('Admin'),affaireController.getAffairesStatusCount);
router.get('/avocats',authenticateToken, roleMiddleware('PersonelJurédique'),affaireController.getAllAvocatsWithAffaireCount);
module.exports = router;



