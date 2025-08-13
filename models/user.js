const Sequelize = require('sequelize');
const sequelize = require('../helper/mysql');
const { type } = require('os');

const Users = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: Sequelize.INTEGER,
}
);

module.exports = Users;