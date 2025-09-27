const User = require('../models/user');
const sib = require('sib-api-v3-sdk');


const client = sib.ApiClient.instance;


client.authentications['api-key'].apiKey = process.env.forgotPassEmail;


const tranEmailApi = new sib.TransactionalEmailsApi();

const forgotPass = async (req, res) => {
    const { email } = req.body;
    // const user = await User.findOne({ where: { email: email } });
    // if (!user) {
    //     return res.status(404).json({ message: 'User not found' });
    // }

    const sender = {
        email: 'anilkumar85290@gmail.com',
        name: 'Anil'
    };

    const receivers = [
        {
            email: email
        },
    ];

    try {
        const emailRes = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Password Reset Request',
            textContent: `Hello, \n\nYou requested a password reset. Please follow this link to reset your password: [RESET_LINK_HERE]\n\nIf you did not request this, please ignore this email.`,
            // htmlContent: `<strong>Hello</strong>,<br>You requested a password reset. Please follow this link to reset your password: <a href="[RESET_LINK_HERE]">Reset Password</a><br>If you did not request this, please ignore this email.`
        });

        console.log('Email sent successfully:', emailRes);
        return res.status(200).json({ message: 'Password reset email sent successfully.', emailResponse: emailRes });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        if (error.response && error.response.text) {
            console.error('Sendinblue API Error Details:', error.response.text);
        }
        return res.status(500).json({ message: 'Failed to send password reset email.', error: error.message });
    }
};

module.exports = {
    forgotPass
};
