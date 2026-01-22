const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const config = require('../config/env');

// Ensure upload directories exist
const uploadDirs = {
  videos: path.join(__dirname, '../../uploads/videos'),
  pdfs: path.join(__dirname, '../../uploads/pdfs'),
  audio: path.join(__dirname, '../../uploads/audio'),
  images: path.join(__dirname, '../../uploads/images'),
  thumbnails: path.join(__dirname, '../../uploads/thumbnails'),
};

Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'],
    audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'],
    pdf: ['application/pdf'],
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  };

  const fileType = file.fieldname;
  const allowedMimes = allowedTypes[fileType] || [];

  if (allowedMimes.length === 0 || allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed types for ${fileType}: ${allowedMimes.join(', ')}`
      ),
      false
    );
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    switch (file.fieldname) {
      case 'video':
        uploadPath = uploadDirs.videos;
        break;
      case 'audio':
        uploadPath = uploadDirs.audio;
        break;
      case 'pdf':
        uploadPath = uploadDirs.pdfs;
        break;
      case 'image':
      case 'thumbnail':
        uploadPath = uploadDirs.images;
        break;
      default:
        uploadPath = uploadDirs.images;
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const sanitizedName = name.replaceAll(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  },
});

// Upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for images (reduced from 500MB)
    fieldSize: 10 * 1024 * 1024, // 10MB max field size
  },
});

// Upload configuration for profile images (smaller size limit)
const uploadProfileImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedMimes.join(', ')}`), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max for profile images
    fieldSize: 10 * 1024 * 1024,
  },
}).single('image');

// Specific upload handlers
const uploadVideo = upload.single('video');
const uploadAudio = upload.single('audio');
const uploadPdf = upload.single('pdf');
const uploadImage = upload.single('image');
const uploadThumbnail = upload.single('thumbnail');

// Multiple file upload for lessons
const uploadLessonFiles = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

// Error handler middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxSize = req.route?.path?.includes('profile-image') ? '10MB' : '500MB';
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${maxSize}`,
        error: err.code,
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Use "image" field for image uploads',
        error: err.code,
      });
    }
    console.error('Multer error:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error',
      error: err.code,
    });
  }
  if (err) {
    console.error('Upload error:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed',
    });
  }
  next();
};

module.exports = {
  upload,
  uploadVideo,
  uploadAudio,
  uploadPdf,
  uploadImage,
  uploadProfileImage,
  uploadThumbnail,
  uploadLessonFiles,
  handleUploadError,
  uploadDirs,
};

