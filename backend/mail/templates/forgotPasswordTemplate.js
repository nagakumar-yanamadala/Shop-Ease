exports.forgotPasswordTemplate = (otp) => {
  return `
  <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:40px">
    <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:30px;text-align:center">
        <h1 style="color:white;margin:0">ShopEase</h1>
        <p style="color:#ddd">Password Reset Request</p>
      </div>
      <div style="padding:40px">
        <h2>Reset Your Password</h2>
        <p>We received a request to reset the password for your ShopEase account. Use the OTP below to set a new password.</p>
        <div style="text-align:center;margin:30px 0">
          <span style="display:inline-block;padding:16px 30px;font-size:32px;letter-spacing:8px;font-weight:bold;background:#eef2ff;color:#4f46e5;border-radius:10px;">
            ${otp}
          </span>
        </div>
        <p>If you did not request a password reset, please safely ignore this email.</p>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    </div>
  </div>
  `;
};