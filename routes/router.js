const express = require('express');
const authRouter = require('./authRouter');

const router = new express.Router();

router.use('/auth', authRouter);

module.exports = router
