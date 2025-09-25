const express = require('express');
const router = express.Router();
const premiumController = require('../controller/premium');
const userAuthentication = require('../auth middleware/auth')


router.post('/pay', userAuthentication.authenticate, premiumController.processPayment);
router.get('/getPaymentStatus/:orderId', userAuthentication.authenticate, premiumController.payStatus)

module.exports= router;