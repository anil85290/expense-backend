const { where } = require('sequelize');
const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.postUser = async (req, res) => {
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

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ where: { email } });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.status(200).json({ message: 'User logged in' });
            } else {
                res.status(400).json({ message: 'Password is incorrect' });
            }
        } else {
            res.status(404).json({ message: 'User does not exist' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message || 'An error occurred during login' });
    }
};
