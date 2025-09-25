const express = require('express');
const router = express.Router();
const addusercontroller = require('../controller/adduser');

router.post('/signup', addusercontroller.postUser);

router.post('/login', addusercontroller.login);

module.exports = router;