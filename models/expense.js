const Sequelize = require('sequelize');
const sequelize = require('../helper/mysql');
const { type } = require('os');

const Expenses = sequelize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount: {
        type: Sequelize.INTEGER
    },
    description: {
        type: Sequelize.STRING,
    },
    category: Sequelize.STRING,
}
);

module.exports = Expenses;