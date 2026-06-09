const otpGenerator = require("otp-generator");
const { forgotPasswordTemplate } = require("../mail/templates/forgotPasswordTemplate");
const OTP = require("../models/otpModel");
const User = require("../models/userModel");

const { hashPassword, verifyPassword } = require("../utils/passwordUtils");

const { sendMail } = require("../mail/mailSender");

const { otpTemplate } = require("../mail/templates/otpTemplate");
const { welcomeTemplate } = require("../mail/templates/welcomeTemplate");

require("dotenv").config();


// ========================================
// GET LOGIN
// ========================================

exports.getLogin = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        loggedIn: false,
      });
    }

    return res.status(200).json({
      loggedIn: true,
      user: req.session.user,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to get login status",
    });
  }
};


// ========================================
// SEND OTP
// ========================================

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await OTP.create({
      email,
      otp,
    });

    await sendMail({
      to: email,
      subject: "ShopEase OTP Verification",
      html: otpTemplate(otp),
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  }catch (err) {
  console.error("SEND OTP ERROR:", err);
  return res.status(500).json({
    success: false,
    message: err.message,
    stack: err.stack
  });
}
};


// ========================================
// VERIFY OTP
// ========================================

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, password, loginType } = req.body;

    const otpResponse = await OTP.findOne({ email, otp });

    if (!otpResponse) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await hashPassword(password);

    const userData = {
      ...req.body,
      password: hashedPassword,
      isUser: loginType === "buyer",
      isSeller: loginType === "seller",
    };

    const user = await User.create(userData);

    await sendMail({
      to: email,
      subject: "Welcome to ShopEase 🎉",
      html: welcomeTemplate(`${user.firstName} ${user.lastName}`),
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};


// ========================================
// LOGIN
// ========================================

exports.postLogin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isValidPassword = await verifyPassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    req.session.user = user;

    req.session.cookie.maxAge = rememberMe
      ? 1000 * 60 * 60 * 24 * 30
      : 1000 * 60 * 60 * 24;

    return res.status(200).json({
      success: true,
      loggedIn: true,
      user,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


// ========================================
// LOGOUT
// ========================================

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    res.clearCookie("connect.sid");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};


// ========================================
// BECOME USER
// ========================================

exports.becomeUser = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isUser: true,
        loginType: "buyer",
      },
      { new: true }
    );

    req.session.user = updatedUser;

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Session save failed",
        });
      }

      return res.status(200).json({
        success: true,
        user: updatedUser,
      });
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to become user",
    });
  }
};


// ========================================
// BECOME SELLER
// ========================================

exports.becomeSeller = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isSeller: true,
        loginType: "seller",
      },
      { new: true }
    );

    req.session.user = updatedUser;

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Session save failed",
        });
      }

      return res.status(200).json({
        success: true,
        user: updatedUser,
      });
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to become seller",
    });
  }
};
// Add this to your imports at the top:
// 

// ========================================
// SEND FORGOT PASSWORD OTP
// ========================================
exports.forgotPasswordSendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email address",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await OTP.create({
      email,
      otp,
    });

    await sendMail({
      to: email,
      subject: "ShopEase Password Reset OTP",
      html: forgotPasswordTemplate(otp),
    });

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully",
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// ========================================
// RESET PASSWORD
// ========================================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpResponse = await OTP.findOne({ email, otp });

    if (!otpResponse) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};
