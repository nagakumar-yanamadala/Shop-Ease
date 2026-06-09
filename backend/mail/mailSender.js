const axios = require("axios");

const sendMail = async ({ to, subject, html }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "ShopEase",
          email: "shopeaseadmin@gmail.com", // verified sender
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Email sending failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = { sendMail };
