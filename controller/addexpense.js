const Expense = require('../models/expense')
const { where } = require('sequelize');


exports.postExpense = async (req, res) => {
    const {amount, description, category} = req.body;
    try{
        const result = await Expense.create({
            amount: amount,
            description: description,
            category: category
        });
        console.log(result);
        res.status(201).json(result);
    }catch{
        res.status(500).json({ error: err.message || 'An error occurred while saving the expense' });
    }
};

exports.getall = async (req, res) => {
    try {
        let result = await Expense.findAll();
        console.log(result);
        res.send(result);
    } catch (error) {
        console.log(error);
        
    }
};

exports.deletebyid = (req, res) => {
    let exid= req.params.id
    console.log(exid);
    Expense.destroy({where:{
        id: exid
    }})
};
