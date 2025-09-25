const Payment = require('../models/premium');
const { createOrder, getPaymentStatus } = require('../services/cashfreeService');
const addusercontroller = require('../controller/adduser')
const User = require('../models/user');
const { where } = require('sequelize');


exports.processPayment = async (req, res) => {
    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const customerID = "1";
    const customerPhone = "9999999999";

    try {
        const paymentSessionId = await createOrder(
            orderId,
            orderAmount,
            orderCurrency,
            customerID,
            customerPhone
        );

        await Payment.create({
            orderId,
            paymentSessionId,
            orderAmount,
            orderCurrency,
            paymentStatus: "Pending",
            userId: req.user.id
        });
        res.json({paymentSessionId, orderId});
    } catch (error) {
        res.status(500).json({message: "error processing payment"});
        console.log(error);
    }
}

exports.payStatus = async (req, res) => {
    try {
        orderid = req.params.orderId
        userId = req.user.id
        const paymentResponse = await getPaymentStatus(orderid);
        if(paymentResponse=='Success'){
            //const token = addusercontroller.generateAccessToken(userId, undefined, {isPremiumUser: true});
            const promise1 = await Payment.update({ paymentStatus: 'Successful' },{ where: { orderId: orderid } });
            const promise2 = await User.update({ isPremiumUser: true}, {where: {id: userId}});
            res.json({paymentStatus: 'Succcessful',});
        }else{
            const promise1 = await Payment.update({ paymentStatus: 'Failure' },{ where: { orderId: orderid } });
            res.json({paymentStatus: 'Failed'});
        }
        
    } catch (error) {
        res.status(500).json({message: "error getting payment status"});
        console.log(error);
    }
};