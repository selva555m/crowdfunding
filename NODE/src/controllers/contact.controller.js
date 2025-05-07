const contactService = require("../services/contact.service");

const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const contact = await contactService.submitContactForm({
      name,
      email,
      message,
    });

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully", contact });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { submitContact };
