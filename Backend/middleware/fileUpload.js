// middleware/fileUpload.js
import multer from 'multer';
import path from 'path';

// Set up storage for the uploaded files (e.g., profile pictures)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Upload folder location (make sure this folder exists)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Append the file extension
    }
});

// File filter to only accept images (you can extend this as needed)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files are allowed'), false); // Reject the file
    }
};

// Initialize multer with the storage and file filter configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    fileFilter: fileFilter
});

export { upload };
