const Expense = require('../models/expense')
const { where } = require('sequelize');
const User = require('../models/user');
const sequelize = require('../helper/mysql')


exports.postExpense = async (req, res) => {
    const {amount, description, category} = req.body;
    try{
        const t = await sequelize.transaction();
        const result = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        },{transaction:t});
        const totalExpense = Number(req.user.totalExpenses) + Number(amount)
        const updatedExpense = await User.update({totalExpenses: totalExpense},{where: {id: req.user.id}},{transaction:t});
        await transaction.commit();
        res.status(201).json(result);
    }catch(err){
        console.log(err);
        await transaction.rollback();
        res.status(500).json({ error: err.message || 'An error occurred while saving the expense' });
    }
};

exports.getall = async (req, res) => {
    try {
        let result = await Expense.findAll({where: {userId: req.user.id}});
        console.log("===========>>>>>>>" + req.user.isPremiumUser);
        if(req.user.isPremiumUser == true){
            res.json({
                exdata: result,
                ispremiumUser: true
            })
        }else{
            res.send(result);
        }
        
    } catch (error) {
        console.log(error);
        
    }
};

exports.deletebyid = async (req, res) => {
    try {
        const t = await sequelize.transaction();
        let exid= req.params.id
        const exAmount = await Expense.findOne({where:{id:exid}},{transaction:t});
        const dlt = await Expense.destroy({where:{
            id: exid,
            userId: req.user.id
        }},{transaction:t});
        const totalExpense = Number(req.user.totalExpenses) - Number(exAmount.amount)
        const updatedExpense = await User.update({totalExpenses: totalExpense},{where: {id: req.user.id}},{transaction:t});
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log(error);
    }
};