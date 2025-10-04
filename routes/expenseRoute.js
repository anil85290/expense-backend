const express = require('express');
const router = express.Router();
const addExpenseController = require('../controller/addexpense')
const userAuthentication = require('../auth middleware/auth')


router.post('/save', userAuthentication.authenticate, addExpenseController.postExpense);

router.delete('/delete/:id', userAuthentication.authenticate, addExpenseController.deletebyid);

router.get('/getall', userAuthentication.authenticate, addExpenseController.getall);
module.exports = router;