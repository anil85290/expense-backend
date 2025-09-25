const express = require('express');
const router = express.Router();
const premiumFeatureController = require('../controller/premiumFeature')

router.get('/showLeaderBoard', premiumFeatureController.getUserLeaderBoard);


module.exports = router;