const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./helper/mysql');
const dotenv = require('dotenv');
dotenv.config();
app.use(cors());
app.use(express.json());
const User = require('./models/user')
const Expense = require('./models/expense')
const Payment = require('./models/premium');
const userroutes = require('./routes/userRoute');
const expenseroutes = require('./routes/expenseRoute')
const premiumroutes = require('./routes/premium');
const premiumFeatureRoutes = require('./routes/premiumfeatures');
const forgotPassRoutes = require('./routes/forgotPass');
const { FORCE } = require('sequelize/lib/index-hints');

app.use('/user', userroutes);
app.use('/expense', expenseroutes);
app.use('/premium', premiumroutes);
app.use('/premiumFeature', premiumFeatureRoutes);
app.use('/forgotPass', forgotPassRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });


sequelize.sync().then((result) => {
    //console.log(result);
    app.listen(3000);
    
}).catch((err) => {
    console.log(err);
});
