const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the upload directory exists
const uploadDir = "src/CampaignFiles";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set the directory to save files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Ensure the file keeps its original extension
  },
});

// File filter to allow specific file types (e.g., images, PDFs, Word docs)
const fileFilter = (req, file, cb) => {
  // Define accepted file types (images, PDFs, Word docs, etc.)
  const allowedTypes =
    /^(image\/|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/;

  if (allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files, PDFs, and Word documents are allowed!"),
      false
    );
  }
};

// Configure multer for file uploads with size limit (5MB)
const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = uploadFile.array("campaignfiles", 5); // Expecting up to 5 files (can include images, PDFs, Word docs)
