const { Schema, model } = require("mongoose");

const donationSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  amount: Number,
  paymentMethod: { type: String, enum: ["Razorpay", "PayPal"] },
  transactionId: String,
  status: {
    type: String,
    enum: ["success", "failed", "pending"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Donation = model("Donation", donationSchema);

module.exports = Donation;
