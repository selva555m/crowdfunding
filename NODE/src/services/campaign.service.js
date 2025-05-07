const Campaign = require("../models/campaign.model");
const User = require("../models/user.model");
const sendEmail = require("../uitiles/mailServiceUser");

const createNewCampaign = async (req) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);
  console.log("User Data:", req.user);

  const { title, description, goalAmount, category, deadline } = req.body;
  const { email } = req.user;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Email", { cause: { status: 401 } });
  }

  // Extract image details and store as an array of objects
  const images = req.files.map((file) => ({
    filename: file.filename,
    path: file.path,
  }));

  // Create campaign
  const campaign = await Campaign.create({
    title,
    description,
    goalAmount,
    images, // Store images as an array of objects
    category,
    deadline,
    creator: req.user._id, // Reference to the user who created the campaign
  });

  // ✅ Send Email Notification to the User
  sendEmail(
    email,
    "Campaign Created Successfully 🚀",
    `<h2>Hey ${user.userName},</h2>
    <p>Your campaign "<strong>${title}</strong>" has been successfully created.</p>
    <p>Our team will review it shortly.</p>
    <p>Thank you for using our platform!</p>`
  );

  return campaign;
};

const getAllCampaigns = async (req) => {
  // console.log(req.body, "this is reqest");
  const campaignAll = await Campaign.find({ isApproved: true })
    .populate("creator", "name email")
    .sort({ _id: -1 });

  // console.log(campaignAll, "this campaign all");
  if (campaignAll.length == 0) {
    throw new Error("No Data Found", { cause: { status: 404 } });
  }
  return campaignAll;
};

const getCampaignsById = async (req) => {
  const { id } = req.params;
  console.log(req.params);
  const campaignById = await Campaign.findById(id).populate(
    "creator",
    "name email"
  );
  if (!campaignById) {
    throw new Error("Data Not Found", { cause: { status: 404 } });
  }
  return campaignById;
};

const updateCampaignFile = async (campaignId, userId, updateData, FileData) => {
  // Find the campaign by ID and user ID
  const campaign = await Campaign.findOne({ _id: campaignId, creator: userId });

  if (!campaign) {
    throw new Error("Campaign not found or user not authorized.");
  }

  console.log("Existing Campaign Data:", campaign);
  console.log("Uploaded File Data:", FileData);

  // Convert object to an array of files if necessary
  const filesArray = Object.values(FileData);

  // If documents are uploaded, append them to the 'documents' array
  if (filesArray.length > 0) {
    const uploadedDocs = filesArray.map((file) => ({
      filename: file.filename,
      path: file.path.replace(/\\/g, "/"), // Normalize path for cross-platform compatibility
    }));

    // Append new files to the existing `documents` array
    campaign.documents = [...campaign.documents, ...uploadedDocs];
  }

  // Update other campaign fields if necessary
  Object.assign(campaign, updateData);

  // Save the updated campaign to the database
  await campaign.save();

  return campaign;
};

const updateCampaign = async (campaignId, userId, updateData) => {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new Error("Campaign not found");
  if (campaign.creator.toString() !== userId)
    throw new Error("Not authorized", { cause: { status: 401 } });

  Object.assign(campaign, updateData, { isApproved: false });
  return await campaign.save();
};

const deleteCampaign = async (campaignId, userId) => {
  const campaign = await Campaign.findById(campaignId);

  if (!campaign) throw new Error("Campaign not found");
  if (campaign.creator.toString() !== userId)
    throw new Error("Not authorized", { cause: { status: 401 } });

  return await campaign.deleteOne();
};

module.exports = {
  createNewCampaign,
  getAllCampaigns,
  getCampaignsById,
  updateCampaign,
  deleteCampaign,
  updateCampaignFile,
};
