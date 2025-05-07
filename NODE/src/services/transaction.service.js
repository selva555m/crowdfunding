const Razorpay = require("razorpay");
const crypto = require("crypto");
const axios = require("axios");
const Transaction = require("../models/transaction.model");
const Campaign = require("../models/campaign.model");
const User = require("../models/user.model");
const sendEmail = require("../uitiles/mailServiceUser");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Function to initiate payout to campaign creator
const initiatePayout = async (fundAccountId, amount) => {
  try {
    const response = await axios.post(
      "https://api.razorpay.com/v1/payouts",
      {
        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
        fund_account_id: fundAccountId,
        amount: amount * 100,
        currency: "INR",
        mode: "IMPS",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: `payout_${Date.now()}`,
        narration: "Campaign Fund Transfer",
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );
    console.log("Payout Response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Payout Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// ✅ Create Payment Order
const createPaymentService = async ({
  amount,
  campaignId,
  userId,
  currency = "INR",
}) => {
  console.log(
    "Creating payment for campaign:",
    campaignId,
    "User:",
    userId,
    "Amount:",
    amount
  );
  if (!amount || !campaignId || !userId)
    throw new Error("Missing required fields");

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const options = {
    amount: amount * 100,
    currency,
    receipt: `txn_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    const transaction = new Transaction({
      campaignId,
      userId,
      amount,
      currency,
      razorpayOrderId: order.id,
      status: "pending",
    });
    await transaction.save();
    return { order, transactionId: transaction._id };
  } catch (error) {
    throw new Error("Error creating payment order");
  }
};

// ✅ Verify Payment and Handle Payouts
// ✅ Verify Payment and Handle Payouts
const verifyPaymentService = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId }) => {
  console.log("Verifying payment...");
  const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (generatedSignature !== razorpay_signature) throw new Error("Invalid signature, payment failed");
  
  const transaction = await Transaction.findById(transactionId).populate("campaignId");
  if (!transaction) throw new Error("Transaction not found");
  
  transaction.razorpayPaymentId = razorpay_payment_id;
  transaction.status = "success";
  
  const campaign = await Campaign.findById(transaction.campaignId).populate("creator");
  if (!campaign) throw new Error("Campaign not found");

  // ✅ Calculate the remaining amount needed
  const remainingAmount = campaign.goalAmount - campaign.currentAmount;

  if (remainingAmount <= 0) {
    throw new Error("Campaign has already reached its goal amount. Cannot accept more donations.");
  }

  // ✅ Accept only up to the goal amount
  const acceptedAmount = Math.min(transaction.amount, remainingAmount);
  campaign.currentAmount += acceptedAmount;
  
  await transaction.save();
  await campaign.save();

  if (campaign.currentAmount >= campaign.goalAmount) {
    campaign.status = "successful";
    await campaign.save();
    console.log("Campaign fully funded!");

    // ✅ Notify campaign creator that the goal has been met
    sendEmail(
      campaign.creator.email,
      "Campaign Fully Funded! 🎉",
      `<h2>Congratulations, ${campaign.creator.userName}!</h2>
       <p>Your campaign <strong>${campaign.title}</strong> has reached its funding goal of ₹${campaign.goalAmount}!</p>
       <p>The admin will contact you soon regarding the next steps.</p>`
    );
  }

  // ✅ Notify the donor
  const user = await User.findById(transaction.userId);
  if (user) {
    sendEmail(
      user.email,
      "Payment Successful 🎉",
      `<h2>Thank you, ${user.userName}!</h2>
       <p>You have successfully donated ₹${acceptedAmount} to the campaign <strong>${campaign.title}</strong>.</p>`
    );
  }

  // ✅ Notify the campaign creator if it's not yet fully funded
  if (campaign.currentAmount < campaign.goalAmount) {
    sendEmail(
      campaign.creator.email,
      "New Donation Received! 🎉",
      `<h2>Congratulations, ${campaign.creator.userName}!</h2>
       <p>You received ₹${acceptedAmount} for your campaign <strong>${campaign.title}</strong>.</p>`
    );
  }

  return { message: `Payment verified successfully. ₹${acceptedAmount} accepted.` };
};


const getTransactionsService = async (userId) => {
  return await Transaction.find({ userId })
    .populate("campaignId", "title")
    .sort({ createdAt: -1 });
};

module.exports = {
  createPaymentService,
  verifyPaymentService,
  getTransactionsService,
};
