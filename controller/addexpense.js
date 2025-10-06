const Expense = require('../models/expense')
const { where, Op } = require('sequelize');
const User = require('../models/user');
const sequelize = require('../helper/mysql')


exports.postExpense = async (req, res) => {
    const {amount, description, category} = req.body;
    let transaction;
    try{
        transaction = await sequelize.transaction();
        const result = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        },{transaction:transaction});
        const totalExpense = Number(req.user.totalExpenses) + Number(amount)
        await User.update({totalExpenses: totalExpense},{where: {id: req.user.id}, transaction: transaction});
        await transaction.commit();
        res.status(201).json(result);
    }catch(err){
        console.error('Error in postExpense:', err);
        if (transaction) {
            await transaction.rollback();
        }
        res.status(500).json({ error: err.message || 'An error occurred while saving the expense' });
    }
};

exports.getall = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        const totalItems = await Expense.count({
            where: { userId: req.user.id }
        });

        const expenses = await Expense.findAll({
            where: { userId: req.user.id },
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']]
        });
        const totalPages = Math.ceil(totalItems / limit);

        const response = {
            data: expenses,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: totalPages
            },
            ispremiumUser: req.user.isPremiumUser
        };
        
        res.status(200).json(response);

    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Failed to retrieve expenses', error: error.message });
    }
};

exports.deletebyid = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let exid = req.params.id;
        const expenseToDelete = await Expense.findOne({
            where: { id: exid, userId: req.user.id }
        }, { transaction: transaction });

        if (!expenseToDelete) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Expense not found or not authorized to delete' });
        }
        const dlt = await Expense.destroy({
            where: {
                id: exid,
                userId: req.user.id
            }
        }, { transaction: transaction });

        if (dlt === 0) { 
            await transaction.rollback();
            return res.status(404).json({ message: 'Expense not found or already deleted' });
        }
        const totalExpense = Number(req.user.totalExpenses) - Number(expenseToDelete.amount);
        await User.update({totalExpenses: totalExpense},{where: {id: req.user.id}, transaction: transaction});
        
        await transaction.commit();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error); 
        if (transaction) {
            await transaction.rollback();
        }
        res.status(500).json({ message: 'Failed to delete expense', error: error.message });
    }
};