const express = require('express');
const router = express.Router();
const forgotPassController = require('../controller/forgotPass');

router.post('/pass', forgotPassController.forgotPass);

router.post('/updatepassword/:resetpasswordid', forgotPassController.updatePassword);

router.get('/resetpassword/:id', forgotPassController.resetPassword)





module.exports= router;