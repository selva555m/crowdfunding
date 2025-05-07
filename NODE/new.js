const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  socialAuthId: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

// Campaign Schema
const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  fundingGoal: { type: Number, required: true },
  amountRaised: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Contribution Schema
const ContributionSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  contributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["success", "failed", "pending"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Admin Schema
const AdminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  permissions: {
    type: [String],
    default: ["approve_campaigns", "manage_reports"],
  },
});

// Export models
module.exports = {
  User: mongoose.model("User", UserSchema),
  Campaign: mongoose.model("Campaign", CampaignSchema),
  Contribution: mongoose.model("Contribution", ContributionSchema),
  Admin: mongoose.model("Admin", AdminSchema),
};

/////////////////////////////
////////////////////////////////
/////

import Campaign from "../models/Campaign";

// Create a New Campaign
export const createCampaign = async (req, res) => {
  try {
    const { title, description, goalAmount, image, category, deadline } =
      req.body;

    const campaign = await Campaign.create({
      title,
      description,
      goalAmount,
      image,
      category,
      deadline,
      creator: req.user.userId, // User who creates the campaign
    });

    res
      .status(201)
      .json({ message: "Campaign created successfully", campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Campaigns
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isApproved: true }).populate(
      "creator",
      "name email"
    );
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Single Campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "creator",
      "name email"
    );
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Campaign (Only Owner)
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(campaign, req.body);
    await campaign.save();

    res
      .status(200)
      .json({ message: "Campaign updated successfully", campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Campaign (Only Owner)
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await campaign.deleteOne();
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve Campaign (Admin Only)
export const approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    campaign.isApproved = true;
    await campaign.save();

    res
      .status(200)
      .json({ message: "Campaign approved successfully", campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

///////////////////////////
////////////////////////////////
////campaign files  store model object of object
const Campaign = require("../models/campaign.model");
const User = require("../models/user.model");

const createNewCampaign = async (req) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    const { title, description, goalAmount, category, deadline } = req.body;
    const { email } = req.user;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Email", { cause: { status: 401 } });
    }

    // Convert images to an object of objects
    let images = {};
    if (req.files.campaignphotos) {
      req.files.campaignphotos.forEach((file, index) => {
        images[`image_${index + 1}`] = {
          filename: file.filename,
          path: file.path,
        };
      });
    }

    // Create campaign
    const campaign = await Campaign.create({
      title,
      description,
      goalAmount,
      images, // Store images as an object of objects
      category,
      deadline,
      creator: req.user._id, // Reference to the user who created the campaign
    });

    return campaign;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw new Error(error.message, { cause: { status: 500 } });
  }
};

module.exports = {
  createNewCampaign,
};

///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
/////////////////////////////////////////////////////
///thois for file creation array of object

const Campaign = require("../models/campaign.model");
const User = require("../models/user.model");

const createNewCampaign = async (req) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);

  const { title, description, goalAmount, category, deadline } = req.body;
  const { email } = req.user;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Email", { cause: { status: 401 } });
  }

  // Extract image details and store as an array of objects
  const images = req.files.campaignphotos
    ? req.files.campaignphotos.map((file) => ({
        filename: file.filename,
        path: file.path,
      }))
    : [];

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

  return campaign;
};

module.exports = {
  createNewCampaign,
};

///////////////////////////////////////////
/////////////////////////////////////////////
////////////////////////////////////////
///frount end connections

const handlePayment = async () => {
  const response = await fetch(
    "http://localhost:5000/api/transactions/create-payment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        amount: 500,
        campaignId: "65f20a47d73a7c0012345678",
      }),
    }
  );

  const data = await response.json();
  if (!data.success) return alert("Payment initiation failed");

  const options = {
    key: "your_razorpay_key_id",
    amount: data.order.amount,
    currency: data.order.currency,
    name: "Crowdfunding App",
    description: "Campaign Donation",
    order_id: data.order.id,
    handler: async (response) => {
      await fetch("http://localhost:5000/api/transactions/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          transactionId: data.transactionId,
        }),
      });
      alert("Payment Successful!");
    },
    prefill: { email: "user@example.com", contact: "9999999999" },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

/////////////////////////////////////////////////////////

///usefund account

/////////////////////////////////////////////////////////
const Campaign = require("../models/campaign.model");
const User = require("../models/user.model");

const createCampaign = async (req, res) => {
  try {
    const { title, description, goalAmount, deadline, category, images } =
      req.body;
    const userId = req.user.id; // Assuming user is authenticated

    // ✅ Fetch user details to get `fundAccountId`
    const user = await User.findById(userId);
    if (!user || !user.fundAccountId) {
      return res
        .status(400)
        .json({ error: "User does not have a valid fund account." });
    }

    const newCampaign = new Campaign({
      title,
      description,
      images,
      goalAmount,
      currentAmount: 0,
      creator: userId,
      creatorFundAccountId: user.fundAccountId, // ✅ Store Fund Account ID
      deadline,
      category,
      status: "active",
    });

    await newCampaign.save();
    res.status(201).json({
      message: "Campaign created successfully!",
      campaign: newCampaign,
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
