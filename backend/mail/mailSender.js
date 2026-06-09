const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("Brevo SMTP Connected Successfully");
  }
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"ShopEase" <${process.env.BREVO_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = { sendMail };
