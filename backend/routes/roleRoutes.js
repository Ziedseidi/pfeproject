const express=require('express');
const router=express.Router();
const roleController=require('../controllers/role.Controller');
const authenticateToken=require('../midelware/auth');
const roleMiddleware =require('../midelware/rbac');

router.post('/create_Role', authenticateToken,roleMiddleware('Admin'),roleController.createRole);
router.post('/assignRole',authenticateToken,roleMiddleware('Admin'),roleController.assignRoleToUser);
router.get('/Roles',authenticateToken,roleMiddleware('Admin'),roleController.getAllRoles);


module.exports=router;