const axios = require("axios");
// const user = require("../models/user.model");
const createFundAccount = async (user) => {
  try {
    const response = await axios.post(
      "https://api.razorpay.com/v1/fund_accounts",
      {
        contact_id: user.razorpayContactId, // User's contact ID (created earlier)
        account_type: "bank_account",
        bank_account: {
          name: user.accountHolderName, // User's bank account holder name
          ifsc: user.ifscCode, // User's bank IFSC code
          account_number: user.accountNumber, // User's bank account number
        },
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    console.log("Fund Account Created:", response.data);
    return response.data.id; // This is the Fund Account ID
  } catch (error) {
    console.error(
      "Error Creating Fund Account:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create fund account");
  }
};

const createRazorpayContact = async (user) => {
  try {
    const response = await axios.post(
      "https://api.razorpay.com/v1/contacts",
      {
        name: user.userName,
        email: user.email,
        type: "customer",
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    console.log("Razorpay Contact Created:", response.data);
    return response.data.id; // Return the Contact ID
  } catch (error) {
    console.error(
      "Error Creating Razorpay Contact:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create Razorpay contact");
  }
};

module.exports = { createFundAccount, createRazorpayContact };
