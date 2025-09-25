// import { Cashfree, CFEnvironment } from "cashfree-pg"; 
const { Cashfree, CFEnvironment } = require("cashfree-pg");
const { Transaction } = require("sequelize");
const cashfree = new Cashfree(CFEnvironment.SANDBOX, "TEST430329ae80e0f32e41a393d78b923034", "TESTaf195616268bd6202eeb3bf8dc458956e7192a85");

const createOrder = async (orderId, orderAmount, orderCurrency="IND", customerID, customerPhone) => {
    try {
        const expiryDate = new Date(Date.now() + 60*60*1000);//1 hr from now
        const formattedExpiryDate = expiryDate.toISOString();

        const request = {
            order_amount: orderAmount,
            order_currency: orderCurrency,
            order_id: orderId,
            customer_details: {
                customer_id: customerID,
                customer_phone: customerPhone
            },
            order_meta: {
                "return_url":`http://localhost:3000/premium/getPaymentStatus/${orderId}`,
                payment_methods: "ccc, upi, nb"
            },
            order_expiry_time: formattedExpiryDate,
        };
        const response = await cashfree.PGCreateOrder(request);
        return response.data.payment_session_id;
    } catch (error) {
        console.log(error);
    }
};

const getPaymentStatus = async (orderId) =>{
    const response  = await cashfree.PGOrderFetchPayments(orderId);
    let getOrderResponse = response.data;
    let orderStatus;

    if (getOrderResponse.filter(transaction => transaction.payment_status === "SUCCESS").length > 0) {
        orderStatus = "Success"
    } else if (getOrderResponse.filter(transaction => transaction.payment_status === "PENDING").length > 0) {
        orderStatus = "Pending"
    } else {
        orderStatus = "Failure"
    };
    return orderStatus;
}

module.exports = {
    createOrder,
    getPaymentStatus
};




