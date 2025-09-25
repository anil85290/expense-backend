const cashfree = Cashfree({
    mode: "sandbox",
});
document.getElementById("renderBtn").addEventListener("click", async () => {
    try {
        const res = await axios.post('http://localhost:3000/premium/pay');
        const data = res.data
        const paymentSessionId = data.paymentSessionId;

        let checkoutOptions = {
            paymentSessionId: paymentSessionId,

            redirectTarget: "_self"
        };

        await cashfree.checkout(checkoutOptions);
    } catch (error) {
        console.log(error);
    }
                
});