const Contact = require("../models/contact.model");
const sendEmail = require("../uitiles/mailServiceUser"); // Utility to send emails

const submitContactForm = async ({ name, email, message }) => {
  // ✅ Save to the database
  const contact = await Contact.create({ name, email, message });

  // ✅ Send email notification to admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

  console.log(adminEmail, "email sevrice");
  const subject = "New Contact Form Submission";
  const emailMessage = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong> ${message}</p>
  `;

  await sendEmail(adminEmail, subject, emailMessage);

  return contact;
};

module.exports = { submitContactForm };
