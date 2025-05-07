const User = require("../models/user.model");
const Campaign = require("../models/campaign.model");
const { generateToken } = require("../middleware/authToken");
const bcrypt = require("bcrypt");
const sendEmail = require("../uitiles/mailServiceUser");

const register = async (req) => {
  console.log(req.body, "this is form service");
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  console.log(userExists,"this fro userexist")

  if (userExists) {
    throw new Error("User Already Exists", { cause: { status: 400 } });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    userName: name,
    email,
    password: hashedPassword,
  });

  // ✅ Send a Welcome Email
  sendEmail(
    email,
    "Welcome to Our Crowd Funding Platform 🎉",
    `<h2>Hi ${name},</h2><p>Thank you for registering! We're excited to have you on board.</p>`
  );

  return user;
};

const login = async (req) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    //   return res.status(401).json({ message: "Invalid email or password" });
    throw new Error("Invalid Email", { cause: { status: 401 } });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch, "dfghjk");
  if (!isMatch) {
    throw new Error("Invalid Password", { cause: { status: 401 } });
  }

  //   const userData = generateToken(user);
  //   const userData = user;
  // res.status(200).json({
  //   _id: user.id,
  //   name: user.name,
  //   email: user.email,
  //   token: generateToken(user.id),
  // });
  return isMatch ? user : "invalid password";
};

const profile = async (req) => {
  console.log(req.user);
  const user = await User.findById(req.user._id);
  console.log(user);
  if (!user) {
    throw new Error("User not found", { cause: { status: 404 } });
  }
  return user;
};

const getUserCampaigns = async (userId) => {
  try {
    return await Campaign.find({ creator: userId });
  } catch (error) {
    throw new Error("Failed to fetch user campaigns");
  }
};

const userData = async (req) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new Error("User not found", { cause: { status: 404 } });
  }
  return user;
};

// const updateUserProfile = async (req) => {
//   const user = await User.findById(req.user._id);
//   if (!user) {
//     throw new Error("User not found", { cause: { status: 404 } });
//   }
//   return user;
// };

const updateUserProfile = async (req) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new Error("User not found", { cause: { status: 404 } });
  }

  if (req.body.userName) user.userName = req.body.userName;
  if (req.body.email) user.email = req.body.email;
  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }
  if (req.file) {
    user.avatar = `/uploads/${req.file.filename}`; // Save file path
  }

  const updatedUser = await user.save();

  // ✅ Send Email Notification on Profile Update
  sendEmail(
    updatedUser.email,
    "Profile Updated Successfully ✅",
    `<h2>Hello ${updatedUser.userName},</h2><p>Your profile has been updated successfully.</p>`
  );

  return updatedUser;
};


module.exports = {
  register,
  login,
  profile,
  userData,
  updateUserProfile,
  getUserCampaigns,
};
