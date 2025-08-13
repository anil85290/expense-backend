const User = require('../models/user')



exports.postUser = (req, res) =>{
    const user = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);
    User.create({
        name: user,
        email: email,
        password: password
    }).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.status(500)
    });
};