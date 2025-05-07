const adminAuthService = require("../services/SuperAdmin.service");
const { generateToken } = require("../middleware/authToken");
const catchAsync = require("../uitiles/catch");
const sendEmail = require("../uitiles/mailServiceUser");
const User = require("../models/user.model");
const Campaign = require("../models/campaign.model");

/**
 * Admin login
 */
const adminLogin = async (req, res) => {
  try {
    const Admintoken = await adminAuthService.adminLogin(req);

    const Data = generateToken(Admintoken);
    res.json({
      token: Data,
      role: Admintoken.role,
    });
  } catch (error) {
    catchAsync(error, res);
  }
};

/**
 * Create Admin (For initial setup)
 */
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await adminAuthService.createAdmin({
      name,
      email,
      password,
      role: "admin",
    });
    res.status(201).json({ success: true, admin });
  } catch (error) {
    catchAsync(error, res);
    // res.status(500).json({ error: err.message });
  }
};

const requestMoreDetails = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("creator");
    if (!campaign || !campaign.creator) {
      return res.status(404).json({ message: "Campaign or creator not found" });
    }

    const recipientEmail = campaign.creator.email;
    const subject = "More Details Required for Your Campaign";
    const message = `
      Hello ${campaign.creator.name || "User"},
      
      We need additional details regarding your campaign: "${campaign.title}". 
      Please provide the necessary information as soon as possible.

      Regards, 
      Admin Team
    `;

    await sendEmail(recipientEmail, subject, message);
    res.json({ message: "Email request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending request email" });
  }
};

const getPendingCampaigns = async (req, res) => {
  try {
    const campaigns = await adminAuthService.getPendingCampaigns();
    res.json(campaigns);
  } catch (error) {
    catchAsync(error, res);
    // res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await adminAuthService.getAllUsersService();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminAuthService.getDashboardStatsService();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await adminAuthService.getAllCampaigns(req);
    res.json(campaigns);
  } catch (error) {
    catchAsync(error, res);
    // res.status(500).json({ error: err.message });
  }
};

const getUserCampaigns = async (req, res) => {
  try {
    const userId = req.params.id;
    const campaigns = await Campaign.find({ creator: userId });

    if (!campaigns.length) {
      return res
        .status(404)
        .json({ message: "No campaigns found for this user" });
    }

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCampaignStatus = async (req, res) => {
  try {
    const { isActive, isApproved } = req.body;
    const campaignId = req.params.id;

    // ✅ Update campaign status in the database
    const updatedCampaign = await adminAuthService.updateCampaignStatus(
      campaignId,
      { isActive, isApproved }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // ✅ Find the campaign creator
    const user = await User.findById(updatedCampaign.creator);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Determine email content based on approval status
    let emailSubject = "";
    let emailMessage = "";

    if (isApproved) {
      emailSubject = "🎉 Your Campaign Has Been Approved!";
      emailMessage = `
        <h2>Good news, ${user.userName}!</h2>
        <p>Your campaign <strong>${updatedCampaign.title}</strong> has been approved and is now live.</p>
        <p>Thank you for being part of our platform! 🚀</p>
      `;
    } else {
      emailSubject = "⚠️ Your Campaign Was Rejected";
      emailMessage = `
        <h2>Hello ${user.userName},</h2>
        <p>Unfortunately, your campaign <strong>${updatedCampaign.title}</strong> was not approved.</p>
        <p>Please check our guidelines and try again.</p>
      `;
    }

    // ✅ Send email notification
    sendEmail(user.email, emailSubject, emailMessage);

    res.json({
      message: "Campaign status updated and email sent!",
      campaign: updatedCampaign,
    });
  } catch (error) {
    catchAsync(error, res);
  }
};

// const updateCampaignStatus = async (req, res) => {
//   try {
//     const { campaignId } = req.params;
//     const { isApproved } = req.body; // "approved" or "rejected"

//     if (![true, false].includes(isApproved)) {
//       return res.status(400).json({ error: "Invalid status value" });
//     }

//     const updatedCampaign = await adminAuthService.updateCampaignStatus(
//       campaignId,
//       isApproved
//     );

//     if (!updatedCampaign) {
//       return res.status(404).json({ error: "Campaign not found" });
//     }

//     res.json({
//       message: `Campaign ${isApproved} successfully`,
//       campaign: updatedCampaign,
//     });
//   } catch (error) {
//     catchAsync(error, res);
//     // res.status(500).json({ error: err.message });
//   }
// };

const deleteCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;

    // ✅ Find the campaign before deleting
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // ✅ Find the user who created the campaign
    const user = await User.findById(campaign.creator);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Delete the campaign from the database
    await adminAuthService.deleteCampaign(campaignId);

    // ✅ Send an email to the user
    const emailSubject = "⚠️ Your Campaign Has Been Deleted";
    const emailMessage = `
      <h2>Hello ${user.userName},</h2>
      <p>We regret to inform you that your campaign <strong>${campaign.title}</strong> has been deleted by the admin.</p>
      <p>If you have any questions, feel free to contact support.</p>
    `;

    sendEmail(user.email, emailSubject, emailMessage);

    res.json({ message: "Campaign deleted and email sent successfully!" });
  } catch (error) {
    catchAsync(error, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await adminAuthService.deleteUserService(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  adminLogin,
  createAdmin,
  getAllCampaigns,
  getPendingCampaigns,
  updateCampaignStatus,
  deleteCampaign,
  getDashboardStats,
  getAllUsers,
  getUserCampaigns,
  deleteUser,
  requestMoreDetails,
};
