const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./helper/mysql');
app.use(cors());
app.use(express.json());
const User = require('./models/user')
const Expense = require('./models/expense')

const userroutes = require('./routes/userRoute');
const expenseroutes = require('./routes/expenseRoute')

app.use('/user', userroutes);
app.use('/expense', expenseroutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync().then((result) => {
    // console.log(result);
    
    
}).catch((err) => {
    console.log(err);
});
app.listen(3000);