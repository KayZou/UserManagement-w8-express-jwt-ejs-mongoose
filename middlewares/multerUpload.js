const multer = require("multer");

// Set storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Destination folder for uploads (adjust the path as needed)
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Add a timestamp to make filenames unique
    const fileName = `profileImage-${timestamp}-${file.originalname}`;
    cb(null, fileName);
  },
});

// Create a multer instance with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
