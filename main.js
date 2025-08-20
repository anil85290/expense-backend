const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./helper/mysql');
app.use(cors());
app.use(express.json());

const userroutes = require('./routes/userRoute');
app.use('/user', userroutes)

sequelize.sync().then((result) => {
    app.listen(3000);
    
}).catch((err) => {
    console.log(err);
});