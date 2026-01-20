const response = require('../utils/response');
const path = require('node:path');
const fs = require('node:fs');
const { uploadDirs } = require('../middleware/upload');

class UploadController {
  /**
   * Upload video file
   * POST /api/upload/video
   */
  async uploadVideo(req, res, next) {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'uploadController.js:uploadVideo',message:'Upload video called',data:{hasFile:!!req.file,fileSize:req.file?.size,fileName:req.file?.originalname},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      if (!req.file) {
        return response.error(res, 'No video file provided', 400);
      }

      const fileUrl = `/uploads/videos/${req.file.filename}`;
      return response.success(
        res,
        {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          url: fileUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`,
        },
        'Video uploaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload audio file
   * POST /api/upload/audio
   */
  async uploadAudio(req, res, next) {
    try {
      if (!req.file) {
        return response.error(res, 'No audio file provided', 400);
      }

      const fileUrl = `/uploads/audio/${req.file.filename}`;
      return response.success(
        res,
        {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          url: fileUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`,
        },
        'Audio uploaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload PDF file
   * POST /api/upload/pdf
   */
  async uploadPdf(req, res, next) {
    try {
      if (!req.file) {
        return response.error(res, 'No PDF file provided', 400);
      }

      const fileUrl = `/uploads/pdfs/${req.file.filename}`;
      return response.success(
        res,
        {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          url: fileUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`,
        },
        'PDF uploaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload image file
   * POST /api/upload/image
   */
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return response.error(res, 'No image file provided', 400);
      }

      const fileUrl = `/uploads/images/${req.file.filename}`;
      return response.success(
        res,
        {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          url: fileUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`,
        },
        'Image uploaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload lesson files (supports multiple types)
   * POST /api/upload/lesson
   */
  async uploadLessonFiles(req, res, next) {
    try {
      const files = req.files || {};
      const result = {};

      if (files.video?.[0]) {
        result.video = {
          filename: files.video[0].filename,
          url: `/uploads/videos/${files.video[0].filename}`,
          fullUrl: `${req.protocol}://${req.get('host')}/uploads/videos/${files.video[0].filename}`,
          size: files.video[0].size,
        };
      }

      if (files.audio?.[0]) {
        result.audio = {
          filename: files.audio[0].filename,
          url: `/uploads/audio/${files.audio[0].filename}`,
          fullUrl: `${req.protocol}://${req.get('host')}/uploads/audio/${files.audio[0].filename}`,
          size: files.audio[0].size,
        };
      }

      if (files.pdf?.[0]) {
        result.pdf = {
          filename: files.pdf[0].filename,
          url: `/uploads/pdfs/${files.pdf[0].filename}`,
          fullUrl: `${req.protocol}://${req.get('host')}/uploads/pdfs/${files.pdf[0].filename}`,
          size: files.pdf[0].size,
        };
      }

      if (files.image?.[0]) {
        result.image = {
          filename: files.image[0].filename,
          url: `/uploads/images/${files.image[0].filename}`,
          fullUrl: `${req.protocol}://${req.get('host')}/uploads/images/${files.image[0].filename}`,
          size: files.image[0].size,
        };
      }

      if (Object.keys(result).length === 0) {
        return response.error(res, 'No files provided', 400);
      }

      return response.success(res, result, 'Files uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Preview lesson content
   * GET /api/upload/preview/:type/:filename
   */
  async previewContent(req, res, next) {
    try {
      const { type, filename } = req.params;
      const validTypes = ['video', 'audio', 'pdf', 'image'];

      if (!validTypes.includes(type)) {
        return response.error(res, 'Invalid content type', 400);
      }

      let filePath;
      switch (type) {
        case 'video':
          filePath = path.join(uploadDirs.videos, filename);
          break;
        case 'audio':
          filePath = path.join(uploadDirs.audio, filename);
          break;
        case 'pdf':
          filePath = path.join(uploadDirs.pdfs, filename);
          break;
        case 'image':
          filePath = path.join(uploadDirs.images, filename);
          break;
      }

      if (!fs.existsSync(filePath)) {
        return response.error(res, 'File not found', 404);
      }

      // Set appropriate headers
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes = {
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.ogg': 'video/ogg',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
      };

      const mimeType = mimeTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);

      // For videos and audio, support range requests for streaming
      if (type === 'video' || type === 'audio') {
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = Number.parseInt(parts[0], 10);
        const end = parts[1] ? Number.parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = end - start + 1;
          const file = fs.createReadStream(filePath, { start, end });
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': mimeType,
          };
          res.writeHead(206, head);
          file.pipe(res);
        } else {
          const head = {
            'Content-Length': fileSize,
            'Content-Type': mimeType,
          };
          res.writeHead(200, head);
          fs.createReadStream(filePath).pipe(res);
        }
      } else {
        // For PDFs and images, send directly
        res.sendFile(path.resolve(filePath));
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete uploaded file
   * DELETE /api/upload/:type/:filename
   */
  async deleteFile(req, res, next) {
    try {
      const { type, filename } = req.params;
      const validTypes = ['video', 'audio', 'pdf', 'image'];

      if (!validTypes.includes(type)) {
        return response.error(res, 'Invalid content type', 400);
      }

      let filePath;
      switch (type) {
        case 'video':
          filePath = path.join(uploadDirs.videos, filename);
          break;
        case 'audio':
          filePath = path.join(uploadDirs.audio, filename);
          break;
        case 'pdf':
          filePath = path.join(uploadDirs.pdfs, filename);
          break;
        case 'image':
          filePath = path.join(uploadDirs.images, filename);
          break;
      }

      if (!fs.existsSync(filePath)) {
        return response.error(res, 'File not found', 404);
      }

      fs.unlinkSync(filePath);
      return response.success(res, null, 'File deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();

