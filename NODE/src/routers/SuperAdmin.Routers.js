// Express Router: SuperAdmin Routes
const express = require("express");
const router = express.Router();
const {
  adminLogin,
  createAdmin,
  getPendingCampaigns,
  updateCampaignStatus,
  getAllCampaigns,
  deleteCampaign,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getUserCampaigns,
  requestMoreDetails,
} = require("../controllers/SuperAdmin.controller");
const { authenticateToken } = require("../middleware/authToken");

// Admin login
router.post("/login", adminLogin);

// Create admin (Run this once to set up an admin)
router.post("/register", createAdmin);

router.post("/campaigns/:id/request-details", requestMoreDetails);

// Get dashboard stats
router.get("/stats", authenticateToken, getDashboardStats);

// User management
router.get("/users", authenticateToken, getAllUsers);
router.delete("/users/:id", authenticateToken, deleteUser);

// Campaign management
router.get("/campaigns", authenticateToken, getAllCampaigns);

router.get("/users/:id/campaigns", authenticateToken, getUserCampaigns);

router.get("/campaigns/pending", authenticateToken, getPendingCampaigns);
router.put("/campaigns/:id/approve", authenticateToken, updateCampaignStatus);
router.delete("/campaigns/:id", authenticateToken, deleteCampaign);

module.exports = router;
