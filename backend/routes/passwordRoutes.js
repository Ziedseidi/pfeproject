const express= require('express');
const router= express.Router();
const passwordController= require('../controllers/password.Controller');

router.post('/request-password-reset', passwordController.requestPasswordReset);
router.post('/reset-password/:token', passwordController.resetPassword);


module.exports=router;
