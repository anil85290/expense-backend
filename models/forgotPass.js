const Sequelize = require('sequelize');
const sequelize = require('../helper/mysql');



const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresAt: Sequelize.DATE
})

module.exports = Forgotpassword;