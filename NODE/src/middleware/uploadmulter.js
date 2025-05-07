const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the upload directory
const uploadDir = path.join(__dirname, "../Uploads");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the verified directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Fixed template literal
  },
});

const upload = multer({ storage });

module.exports = upload;
