const {
  createPaymentService,
  verifyPaymentService,
  getTransactionsService,

} = require("../services/transaction.service");

// ✅ Create Payment Order
const createPayment = async (req, res) => {
  try {
    console.log(req.body, "this is back payment");
    const { amount, campaignId, currency } = req.body;
    const userId = req.user._id; // Extracted from authentication middleware

    const result = await createPaymentService({
      amount,
      campaignId,
      userId,
      currency,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Payment initiation failed", error: error.message });
  }
};

// ✅ Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transactionId,
    } = req.body;

    const result = await verifyPaymentService({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transactionId,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Payment verification failed", error: error.message });
  }
};

// ✅ Get Transactions
// const getTransactions = async (req, res) => {
//   try {
//     const transactions = await getTransactionsService(req.user._id);
//     res.json(transactions);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching transactions", error: error.message });
//   }
// };

const getUserDonations = async (req, res) => {
  try {
    const transactions = await getTransactionsService(req.user._id);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching donation history:", error);
    res.status(500).json({ message: "Failed to fetch donation history" });
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  // getTransactions,
  getUserDonations,
};
