const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [
    {
      filename: { type: String, required: true },
      path: { type: String, required: true },
    },
  ], // Now an array to store multiple images
  goalAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deadline: { type: Date, required: true },
  category: {
    type: String,
    enum: ["Technology", "Health", "Education", "Art", "Other"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "successful", "failed"],
    default: "active",
  },
  isActive: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },

  // Adding a new field for PDF documents
  documents: [
    {
      filename: { type: String, default: "" },
      path: { type: String, default: "" },
    },
  ], // Store the PDFs with filename and path
  createdAt: { type: Date, default: Date.now },
});

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
