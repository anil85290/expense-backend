const User = require('../models/user');
const sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const Forgotpassword = require('../models/forgotPass');
const bcrypt = require('bcrypt');
const util = require('util');

const genSalt = util.promisify(bcrypt.genSalt);
const hashPassword = util.promisify(bcrypt.hash);

const client = sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

const tranEmailApi = new sib.TransactionalEmailsApi();

const forgotPass = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ message: 'User with this email not found.' });
        }
        const resetToken = uuidv4();
        const resetLink = `http://localhost:3000/forgotPass/resetpassword/${resetToken}`;
        await user.createForgotpassword({
            id: resetToken,
            active: true,
            expiresAt: new Date(Date.now() + 3600 * 1000),
        });
        const sender = {
            email: 'nabazzad@gmail.com',
            name: 'Anil'
        };

        const receivers = [{ email: email }];
        const emailRes = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Password Reset Request',
            htmlContent: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                            .button { display: inline-block; background-color: #007bff; color: white !important; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Password Reset Request</h2>
                            <p>Hello,</p>
                            <p>You recently requested to reset the password for your account.</p>
                            <p>Please click on the button below to reset your password:</p>
                            <p><a href="${resetLink}" class="button">Reset Your Password</a></p>
                            <p>This link is valid for a limited time (e.g., 1 hour). If the link has expired, you will need to request a new one.</p>
                            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                            <p>Thank you,<br>The Your App Team</p>
                            <p><small>If the button above doesn't work, copy and paste this URL into your browser: <br>${resetLink}</small></p>
                        </div>
                    </body>
                </html>
            `,
        });

        return res.status(200).json({ message: 'Password reset email sent successfully. Please check your inbox.', emailResponse: emailRes });

    } catch (error) {
        console.error('Error in forgotPass:', error);
        if (error.response && error.response.text) {
            console.error('Sendinblue API Error Details:', error.response.text);
        }
        return res.status(500).json({ message: 'Failed to process password reset request. Please try again later.', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const id = req.params.id;

    try {
        const forgotPassReq = await Forgotpassword.findOne({ where: { id, active: true } });

        if (forgotPassReq) {
            res.status(200).send(`
                <html>
                    <head>
                        <title>Reset Password</title>
                        <style>
                            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f4f4; margin: 0; }
                            form { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; box-sizing: border-box; }
                            h2 { text-align: center; color: #333; margin-bottom: 25px; }
                            label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
                            input[type="password"] { width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 16px; }
                            button { background-color: #007bff; color: white; padding: 12px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; width: 100%; }
                            button:hover { background-color: #0056b3; }
                        </style>
                    </head>
                    <body>
                        <form action="/forgotPass/updatepassword/${id}" method="post">
                            <h2>Set New Password</h2>
                            <label for="newPassword">Enter New Password:</label>
                            <input name="newPassword" type="password" required minlength="4" placeholder="new Password" autocomplete="new-password"></input>
                            <button type="submit">Reset Password</button>
                        </form>
                    </body>
                </html>
            `);
        } else {
            return res.status(400).send(`
                <html>
                    <head>
                        <title>Invalid Link</title>
                        <style>
                            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f4f4; margin: 0; text-align: center; }
                            div { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; box-sizing: border-box; }
                            h2 { color: #dc3545; margin-bottom: 15px; }
                            p { color: #666; }
                            a { color: #007bff; text-decoration: none; }
                            a:hover { text-decoration: underline; }
                        </style>
                    </head>
                    <body>
                        <div>
                            <h2>Invalid or Expired Link</h2>
                            <p>The password reset link is invalid or has expired. Please request a new password reset.</p>
                            <p><a href="http://localhost:3000/forgotPass/pass">Request New Password Reset</a></p>
                        </div>
                    </body>
                </html>
            `);
        }
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).send(`
            <html>
                <head>
                    <title>Error</title>
                    <style>
                        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f4f4; margin: 0; text-align: center; }
                        div { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; box-sizing: border-box; }
                        h2 { color: #dc3545; margin-bottom: 15px; }
                        p { color: #666; }
                    </style>
                </head>
                <body>
                    <div>
                        <h2>Server Error</h2>
                        <p>An internal server error occurred while processing your request. Please try again later.</p>
                    </div>
                </body>
            </html>
        `);
    }
};

const updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { resetpasswordid } = req.params; // The reset token from the URL
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
        }
        const resetPassReq = await Forgotpassword.findOne({ where: { id: resetpasswordid, active: true } });

        if (!resetPassReq) {
            return res.status(400).json({ message: 'Invalid or expired password reset link. Please request a new one.' });
        }
        const user = await User.findOne({ where: { id: resetPassReq.userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found for this reset request.' });
        }
        const saltRounds = 10;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hashPassword(newPassword, salt);

        await user.update({ password: hashedPassword });
        await resetPassReq.update({ active: false });

        res.status(200).json({ message: 'Password updated successfully!' });

    } catch (error) {
        console.error('Error in updatePassword:', error);
        return res.status(500).json({ message: 'An internal server error occurred while updating the password. Please try again later.', error: error.message });
    }
};

module.exports = {
    forgotPass,
    resetPassword,
    updatePassword
};