const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads/' exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + extension); // save file name as "filename-11684523.png"
        //cb(null, `${req.user.userId}${extension}`); // Save file as userId.extension
    }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
  fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Only JPEG, PNG, and GIF files are allowed'));
      }
      cb(null, true);
  }
}).single('picture'); // this is the expected file name from the client


// Middleware function to handle file upload
const uploadPicture = (req, res, next) => {
  upload(req, res, (err) => {
      if (err) {
          if (err instanceof multer.MulterError) {
              // Handle Multer-specific errors
              if (err.code === 'LIMIT_FILE_SIZE') {
                  return res.status(400).json({ message: 'File is too large. Max size is 5MB.' });
              } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                  return res.status(400).json({ message: 'Unexpected file field. Ensure the correct field name \'picture\' is used.' });
              }
          } else if (err.message === 'Only JPEG, PNG, and GIF files are allowed') {
              return res.status(400).json({ message: err.message });
          }
          return res.status(500).json({ message: 'Error during file upload.' });
      }
      next(); // Proceed to the next middleware or route handler
  });
};


module.exports = uploadPicture;