const jwt = require("jsonwebtoken");

const generateToken = (data) => {
  return jwt.sign({ data }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  try {
    const secretKey = process.env.JWT_KEY; // Use process.env.JWT_SECRET in production
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded.data,"This is auth ")

    req.user = decoded.data; // Attach user info to request
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
module.exports = {
  generateToken,
  authenticateToken,
};
