const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  razorpayOrderId: {
    type: String,
    required: true,
  }, // Stores Razorpay Order ID
  razorpayPaymentId: { type: String, default: null },
  paymentMethod: {
    type: String,
    default: "UPI",
  }, // e.g., UPI, Card, Net Banking
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexing for faster lookups
transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
