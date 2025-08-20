const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./helper/mysql');
app.use(cors());
app.use(express.json());

const userroutes = require('./routes/userRoute');
const expenseroutes = require('./routes/expenseRoute')

app.use('/user', userroutes);
app.use('/expense', expenseroutes);

sequelize.sync().then((result) => {
    // console.log(result);
    app.listen(3000);
    
}).catch((err) => {
    console.log(err);
});