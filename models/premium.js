const Sequelize = require('sequelize');
const sequelize = require('../helper/mysql');
const { type } = require('os');

const Payment = sequelize.define('payment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    orderId: Sequelize.STRING ,
    paymentSessionId: Sequelize.STRING,
    orderAmount: Sequelize.INTEGER,
    orderCurrency: Sequelize.STRING,
    paymentStatus: Sequelize.STRING,
    // userId: {
    //     type: Sequelize.INTEGER,
    //     references: {
    //         model: 'users', // This should be the pluralized name of your User model's table
    //         key: 'id'
    //     }
    // },
}
);

module.exports = Payment;