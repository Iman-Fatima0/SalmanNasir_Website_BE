const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const {
  uploadVideo,
  uploadAudio,
  uploadPdf,
  uploadImage,
  uploadLessonFiles,
  handleUploadError,
} = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

// Helper middleware to check if user is admin or instructor
const requireAdminOrInstructor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Check if user is admin or instructor
  const userRole = req.user.role?.toLowerCase();
  if (userRole !== 'admin' && userRole !== 'instructor') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin or instructor role required',
    });
  }

  next();
};

// Upload routes (admin and instructor only)
// Note: authenticate must come BEFORE multer middleware
// Multer middleware must come before the controller
router.post(
  '/video',
  authenticate,
  requireAdminOrInstructor,
  (req, res, next) => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'uploadRoutes.js:beforeMulter',message:'Before multer middleware',data:{user:req.user?.email,role:req.user?.role},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    next();
  },
  uploadVideo,
  handleUploadError,
  uploadController.uploadVideo
);

router.post(
  '/audio',
  authenticate,
  requireAdminOrInstructor,
  uploadAudio,
  handleUploadError,
  uploadController.uploadAudio
);

router.post(
  '/pdf',
  authenticate,
  requireAdminOrInstructor,
  uploadPdf,
  handleUploadError,
  uploadController.uploadPdf
);

router.post(
  '/image',
  authenticate,
  requireAdminOrInstructor,
  uploadImage,
  handleUploadError,
  uploadController.uploadImage
);

router.post(
  '/lesson',
  authenticate,
  requireAdminOrInstructor,
  uploadLessonFiles,
  handleUploadError,
  uploadController.uploadLessonFiles
);

// Preview routes (public, but can be restricted if needed)
router.get('/preview/:type/:filename', uploadController.previewContent);

// Delete routes (admin and instructor only)
router.delete(
  '/:type/:filename',
  authenticate,
  requireAdminOrInstructor,
  uploadController.deleteFile
);

module.exports = router;

