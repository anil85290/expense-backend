const express = require('express');
const router = express.Router();
const addExpenseController = require('../controller/addexpense')


router.post('/save', addExpenseController.postExpense);

router.delete('/deletebyid/:id', addExpenseController.deletebyid);

router.get('/getall', addExpenseController.getall);
module.exports = router;