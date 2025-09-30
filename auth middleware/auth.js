const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res , next) => {
    try {
        const token = req.header('Authorization');
        const id = jwt.verify(token, process.env.jwtSecretKey);
        const user = await User.findByPk(id.userID);
        req.user =user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({success: false})
    }
}
module.exports = {
    authenticate
}