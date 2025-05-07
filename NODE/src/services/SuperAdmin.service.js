const Admin = require("../models/SuperAdmin.model");
const User = require("../models/user.model");
const Campaign = require("../models/campaign.model");
const Transaction = require("../models/transaction.model");
const sendEmail = require("../uitiles/mailServiceUser");

/**
 * Admin login
 */
const adminLogin = async (req) => {
  console.log(req.body);
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error("Admin not found");
  const isMatch = await admin.comparePassword(password);
  console.log(isMatch);
  if (!isMatch) throw new Error("Invalid credentials");

  return isMatch ? admin : "Invalied Access";
};

/**
 * Create a new admin (For initial setup)
 */
const createAdmin = async (data) => {
  const admin = new Admin(data);
  return await admin.save();
};

const getPendingCampaigns = async () => {
  return await Campaign.find({ isApproved: false }) // ✅ Fetch only inactive & unapproved campaigns
    .populate("creator", "name email")
    .sort({ _id: -1 });
};

const getAllUsersService = async () => {
  try {
    return await User.find({}, "-password"); // Exclude password for security
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Internal Server Error");
  }
};

const getAllCampaigns = async (req) => {
  const { isApproved } = req.query;
  return await Campaign.find({ isApproved }).populate("creator", "name email");
};

const getDashboardStatsService = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ isActive: true });
    const totalDonations = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const pendingApprovals = await Campaign.countDocuments({
      isApproved: "false",
    });

    return {
      totalUsers,
      activeCampaigns,
      totalDonations: totalDonations.length > 0 ? totalDonations[0].total : 0,
      pendingApprovals,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Internal Server Error");
  }
};

// const updateCampaignStatus = async (campaignId, statusUpdates) => {
//   return await Campaign.findByIdAndUpdate(campaignId, statusUpdates, {
//     new: true,
//   });
// };

const updateCampaignStatus = async (campaignId, statusUpdates) => {
  return await Campaign.findByIdAndUpdate(campaignId, statusUpdates, {
    new: true,
  });
};

const deleteCampaign = async (campaignId) => {
  return await Campaign.findByIdAndDelete(campaignId);
};

const deleteUserService = async (userId) => {
  // ✅ Check if user exists

  console.log(userId, "this from user");
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // ✅ Delete the user
  await User.findByIdAndDelete(userId);

  // ✅ Send Email Notification
  const emailSubject = "⚠️ Your Account Has Been Deleted";
  const emailMessage = `
    <h2>Hello ${user.userName},</h2>
    <p>We regret to inform you that your account has been deleted by the admin.</p>
    <p>If you have any questions, please contact support.</p>
  `;
  sendEmail(user.email, emailSubject, emailMessage);

  return { message: "User deleted successfully!" };
};
module.exports = {
  adminLogin,
  createAdmin,
  getAllCampaigns,
  getPendingCampaigns,
  updateCampaignStatus,
  deleteCampaign,
  getDashboardStatsService,
  getAllUsersService,
  deleteUserService,
};
