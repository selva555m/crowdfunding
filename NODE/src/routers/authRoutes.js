const { Router } = require("express");
const router = Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  // updateUserProfile,
  updateUserProfileController,
  getuserdata,
  getUserCampaigns,
} = require("../controllers/auth.controller");
const upload = require("../middleware/uploadmulter"); // Import multer middleware

const { authenticateToken } = require("../middleware/authToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, getUserProfile);
router.get("/userdata", authenticateToken, getuserdata);

router.get("/campaigns", authenticateToken, getUserCampaigns);

// router.put("/profile", authenticateToken, updateUserProfileController);
router.put(
  "/profile",
  authenticateToken,
  upload.single("avatar"),
  updateUserProfileController
);

module.exports = router;
