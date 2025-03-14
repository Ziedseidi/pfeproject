const express=require('express');
const router=express.Router();
const roleController=require('../controllers/role.Controller');

router.post('/create_Role', roleController.createRole);
router.post('/assignRole',roleController.assignRoleToUser);


module.exports=router;