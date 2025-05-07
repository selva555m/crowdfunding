const express = require("express");
const {
  createPayment,
  verifyPayment,
  // getTransactions,
  getUserDonations,
} = require("../controllers/transaction.controller");
const { authenticateToken } = require("../middleware/authToken");

const router = express.Router();

router.post("/create-payment", authenticateToken, createPayment);
router.post("/verify-payment", verifyPayment);
// router.get("/", authenticateToken, getTransactions);
router.get("/history", authenticateToken, getUserDonations);

module.exports = router;
