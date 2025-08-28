const express=require('express');
const router=express.Router();
const authenticateToken=require('../midelware/auth');
const roleMiddleware =require('../midelware/rbac');
const adminController=require('../controllers/admin.Controller');

router.delete('/deleteUser/:userId', authenticateToken, roleMiddleware('Admin'), adminController.deleteUser);
router.patch('/toggleUserActivation/:userId', authenticateToken, roleMiddleware('Admin'), adminController.toggleUserActivation);
router.get('/All-users', authenticateToken, roleMiddleware('Admin'),adminController.getAllUsersWithInfo);
router.post('/send-email-to-user', authenticateToken, roleMiddleware('Admin'), adminController.sendEmailToUser);
router.patch('/updateUser/:userId',authenticateToken,roleMiddleware('Admin')  ,adminController.updateUser);



module.exports = router;
