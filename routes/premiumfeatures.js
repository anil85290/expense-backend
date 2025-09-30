const express = require('express');
const router = express.Router();
const premiumFeatureController = require('../controller/premiumFeature')
const userAuthentication = require('../auth middleware/auth')

router.get('/showLeaderBoard', premiumFeatureController.getUserLeaderBoard);

router.get('/download', userAuthentication.authenticate, premiumFeatureController.downloadExpenses);

module.exports = router;