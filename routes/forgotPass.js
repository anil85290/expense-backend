const express = require('express');
const router = express.Router();
const forgotPassController = require('../controller/forgotPass');

router.post('/pass', forgotPassController.forgotPass);







module.exports= router;