const { where } = require('sequelize');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const postUser = async (req, res) => {
    const user = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const saltRounds = 10;

    try {
        const hash = await bcrypt.hash(password, saltRounds);

        await User.create({
            name: user,
            email: email,
            password: hash
        });

        res.status(201).json({ message: 'User saved' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message || 'An error occurred while saving the user' });
    }
};

const generateAccessToken = (id, user, isPremiumUser) => {
    return jwt.sign({userID: id, name: user, isPremiumUser}, process.env.JWT_SECRET_KEY)
};

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ where: { email } });
        
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = generateAccessToken(user.id, user.name, user.isPremiumUser);
                return res.status(200).json({ token });
            } else {
                return res.status(400).json({ message: 'Password is incorrect' });
            }
        } else {
            return res.status(404).json({ message: 'User does not exist' });
        }
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: err.message || 'An error occurred during login' });
    }
};

module.exports = {
    postUser,
    login,
    generateAccessToken
};