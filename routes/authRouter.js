const express = require('express');
const router = new express.Router();
const authController = require('../app/auth/auth.controller');
const { validateAuth } = require('../middlewares/validateAuth');

router.post('/sign_in', validateAuth('login'), authController.signIn);
router.post('/sign_up', validateAuth('register'), authController.signUp);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;
