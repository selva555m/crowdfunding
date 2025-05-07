const authservice = require("../services/auth.service");
const { generateToken } = require("../middleware/authToken");
const catchAsync = require("../uitiles/catch");

const registerUser = async (req, res) => {
  try {
    console.log(req.body, "this form userrrr");
    const userData = await authservice.register(req);
    res.status(201).json(
      //   message: "Registered Successfully",
      userData
    );
  } catch (error) {
    catchAsync(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const userData = await authservice.login(req);
    console.log(userData, "this is ctrl");
    const Data = generateToken(userData);
    res.status(201).json(
      //  token message : "Login Successfully",
      {
        token: Data,
        role: userData.role,
      }
    );
  } catch (error) {
    catchAsync(error, res);
  }
};

const getUserCampaigns = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId, "this fron user"); // Extract user ID from token
    const campaigns = await authservice.getUserCampaigns(userId);

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching user campaigns:", error);
    catchAsync(error, res);
    // res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userProfile = await authservice.profile(req);
    res.status(200).json(userProfile);
  } catch (error) {
    catchAsync(error, res);
  }
};

const getuserdata = async (req, res) => {
  try {
    const userData = await authservice.userData(req);
    res.status(200).json(userData);
  } catch (error) {
    catchAsync(error, res);
  }
};

// const updateUserProfile = async (req, res) => {
//   try {
//     const user = await authservice.updateUserProfile(req);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;

//     if (req.body.password) {
//       user.password = await bcrypt.hash(req.body.password, 10);
//     }

//     const updatedUser = await user.save();
//     res.status(200).json({
//       _id: updatedUser.id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       token: generateToken(updatedUser.id),
//     });
//   } catch (error) {
//     catchAsync(error, res);
//     // res.status(500).json({ error: error.message });
//   }
// };

const updateUserProfileController = async (req, res) => {
  try {
    const updatedUser = await authservice.updateUserProfile(req);

    res.status(200).json({
      _id: updatedUser.id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      role: updatedUser.role,
      socialAuthProvider: updatedUser.socialAuthProvider,
      createdAt: updatedUser.createdAt,
      avatar: updatedUser.avatar, // Return the new profile image
      token: generateToken(updatedUser.id),
    });
  } catch (error) {
    res.status(error.cause?.status || 500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  // updateUserProfile,
  getuserdata,
  getUserCampaigns,
  updateUserProfileController,
};
