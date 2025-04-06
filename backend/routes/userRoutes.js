const express=require('express');
const router=express.Router();
const authenticateToken=require('../midelware/auth');
const roleMiddleware =require('../midelware/rbac');
const adminController=require('../controllers/admin.Controller');

router.delete('/deleteUser/:userId', authenticateToken, roleMiddleware('Admin'), adminController.deleteUser);
router.patch('/toggleUserActivation/:userId', authenticateToken, roleMiddleware('Admin'), adminController.toggleUserActivation);
router.get('/All-users', authenticateToken, roleMiddleware('Admin'),adminController.getAllUsersWithInfo);

module.exports = router;
