const express = require("express");
const { submitContact } = require("../controllers/contact.controller");

const router = express.Router();

// Route to handle contact form submissions
router.post("/", submitContact);

module.exports = router;
