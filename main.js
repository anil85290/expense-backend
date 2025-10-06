const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./helper/mysql');
const dotenv = require('dotenv');
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const User = require('./models/user')
const Expense = require('./models/expense')
const Payment = require('./models/premium');
const Forgotpassword = require('./models/forgotPass');
const userroutes = require('./routes/userRoute');
const expenseroutes = require('./routes/expenseRoute')
const premiumroutes = require('./routes/premium');
const premiumFeatureRoutes = require('./routes/premiumfeatures');
const forgotPassRoutes = require('./routes/forgotPass');

app.use('/user', userroutes);
app.use('/expense', expenseroutes);
app.use('/premium', premiumroutes);
app.use('/premiumFeature', premiumFeatureRoutes);
app.use('/forgotPass', forgotPassRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

// sequelize.sync().then((result) => {
//     //console.log(result);
    
    
// }).catch((err) => {
//     console.log(err);
// });

app.listen(3000, () => {
    console.log('port ====> 3000');
});
