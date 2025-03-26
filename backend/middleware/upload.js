const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir;

        // Determine directory based on request path or field name
        if (req.baseUrl.includes('/items')) {
            uploadDir = path.join(__dirname, '../uploads/items');
        } else if (req.baseUrl.includes('/users')) {
            uploadDir = path.join(__dirname, '../uploads/users');
        } else {
            uploadDir = path.join(__dirname, '../uploads/misc'); // Fallback for other uploads
        }

        ensureDirExists(uploadDir); // Create directory if it doesn't exist
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        //cb(null, file.fieldname + '-' + Date.now() + extension); // save file name as "filename-11684523.png"
        cb(null, `${req.user.userId}-${Date.now()}${extension}`); // Save file as userId-11684523.extension
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