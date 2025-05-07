const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure env variables are loaded

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password (NOT regular email password)
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`, // Set a clear sender name
      to,
      subject,
      html: htmlContent,
    });

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
