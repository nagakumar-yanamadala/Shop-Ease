const express = require('express');
const authRouter = express.Router();

const {
  sendOTP,
  verifyOTP,
  postLogin,
  getLogin,
  logout,
  becomeUser,
  becomeSeller,
  forgotPasswordSendOTP, // <-- Import new
  resetPassword          // <-- Import new
} = require('../controllers/authController');

authRouter.post('/send-otp', sendOTP);
authRouter.post('/verify-otp', verifyOTP);
authRouter.post('/login', postLogin);
authRouter.post("/logout", logout);
authRouter.get('/me', getLogin);
authRouter.post('/become-user', becomeUser);
authRouter.post('/become-seller', becomeSeller);

// <-- Add new routes
authRouter.post('/forgot-password-otp', forgotPasswordSendOTP);
authRouter.post('/reset-password', resetPassword);

module.exports = authRouter;