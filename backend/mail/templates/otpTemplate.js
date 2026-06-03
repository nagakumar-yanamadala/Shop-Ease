
exports.otpTemplate = (otp) => {
  return `
  <div style = "font-family:Arial,sans-serif;background:#f4f7fb;padding:40px" >

    <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden">

      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:30px;text-align:center">
        <h1 style="color:white;margin:0">ShopEase</h1>
        <p style="color:#ddd">OTP Verification</p>
      </div>

      <div style="padding:40px">

        <h2>Verify Your Email</h2>

        <p>
          Use the OTP below to complete your signup process.
        </p>

        <div style="text-align:center;margin:30px 0">
          <span style="
            display:inline-block;
            padding:16px 30px;
            font-size:32px;
            letter-spacing:8px;
            font-weight:bold;
            background:#eef2ff;
            color:#4f46e5;
            border-radius:10px;
          ">
            ${otp}
          </span>
        </div>

        <p>This OTP is valid for 5 minutes.</p>

      </div>

    </div>

  </div>
  `;
};

