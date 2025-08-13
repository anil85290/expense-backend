const Sequelize = require('sequelize');
const sequelize = new Sequelize('expense-tracker', 'root', 'taa.wjtp', {
    dialect: 'mysql',
    host: 'localhost'
});
module.exports = sequelize