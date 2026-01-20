# 📁 File Upload & Preview Guide

## Overview

The backend now supports file uploads for all lesson content types (Video, Audio, PDF, Text, Quiz) with preview functionality.

## 📤 Upload Endpoints

### Base URL
```
POST /api/upload/{type}
```

### Authentication
All upload endpoints require authentication and admin/instructor role.

### 1. Upload Video
```http
POST /api/upload/video
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- video: (file) - Video file (mp4, webm, ogg, mov, avi)
```

**Response:**
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "filename": "my_video-1234567890-987654321.mp4",
    "originalName": "my_video.mp4",
    "size": 52428800,
    "mimetype": "video/mp4",
    "url": "/uploads/videos/my_video-1234567890-987654321.mp4",
    "fullUrl": "http://localhost:3000/uploads/videos/my_video-1234567890-987654321.mp4"
  }
}
```

### 2. Upload Audio
```http
POST /api/upload/audio
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- audio: (file) - Audio file (mp3, wav, ogg, webm)
```

### 3. Upload PDF
```http
POST /api/upload/pdf
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- pdf: (file) - PDF file
```

### 4. Upload Image
```http
POST /api/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: (file) - Image file (jpg, png, gif, webp)
```

### 5. Upload Multiple Lesson Files
```http
POST /api/upload/lesson
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- video: (file, optional)
- audio: (file, optional)
- pdf: (file, optional)
- image: (file, optional)
```

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": {
    "video": {
      "filename": "video-123.mp4",
      "url": "/uploads/videos/video-123.mp4",
      "fullUrl": "http://localhost:3000/uploads/videos/video-123.mp4",
      "size": 52428800
    },
    "pdf": {
      "filename": "document-456.pdf",
      "url": "/uploads/pdfs/document-456.pdf",
      "fullUrl": "http://localhost:3000/uploads/pdfs/document-456.pdf",
      "size": 1048576
    }
  }
}
```

## 👁️ Preview Endpoints

### Preview Content
```http
GET /api/upload/preview/:type/:filename
```

**Parameters:**
- `type`: `video`, `audio`, `pdf`, or `image`
- `filename`: The filename returned from upload

**Examples:**
```
GET /api/upload/preview/video/my_video-1234567890-987654321.mp4
GET /api/upload/preview/audio/my_audio-1234567890-987654321.mp3
GET /api/upload/preview/pdf/my_document-1234567890-987654321.pdf
GET /api/upload/preview/image/my_image-1234567890-987654321.jpg
```

**Features:**
- Videos and audio support **range requests** for streaming
- PDFs and images are served directly
- No authentication required (public preview)

## 🗑️ Delete Endpoints

### Delete Uploaded File
```http
DELETE /api/upload/:type/:filename
Authorization: Bearer <token> (Admin/Instructor only)
```

**Example:**
```
DELETE /api/upload/video/my_video-1234567890-987654321.mp4
```

## 📝 Course Creation with File Uploads

### Frontend Flow

1. **Upload files first** (before creating course)
2. **Get file URLs** from upload responses
3. **Create course** with file URLs in lesson data

### Example: Creating Course with Uploaded Files

```javascript
// Step 1: Upload video file
const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file);

  const response = await fetch('http://localhost:3000/api/upload/video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  return result.data.fullUrl; // Use this URL in course creation
};

// Step 2: Create course with uploaded file URL
const createCourse = async () => {
  const videoUrl = await uploadVideo(videoFile);

  const courseData = {
    title: "Arabic A1",
    description: "Beginner Arabic course",
    price: 99.99,
    language: "ar",
    level: "beginner",
    chapters: [
      {
        title: "Introduction",
        order: 1,
        lessons: [
          {
            title: "Welcome Video",
            description: "Introduction to the course",
            order: 1,
            type: "VIDEO",
            videoUrl: videoUrl, // Use uploaded file URL
            durationMinutes: 10,
            isPreview: true
          }
        ]
      }
    ]
  };

  const response = await fetch('http://localhost:3000/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });

  return await response.json();
};
```

## 🎬 Preview Implementation

### Video Preview
```html
<video controls>
  <source src="http://localhost:3000/api/upload/preview/video/filename.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

### Audio Preview
```html
<audio controls>
  <source src="http://localhost:3000/api/upload/preview/audio/filename.mp3" type="audio/mpeg">
  Your browser does not support the audio tag.
</audio>
```

### PDF Preview
```html
<iframe 
  src="http://localhost:3000/api/upload/preview/pdf/filename.pdf" 
  width="100%" 
  height="600px">
</iframe>
```

### Image Preview
```html
<img 
  src="http://localhost:3000/api/upload/preview/image/filename.jpg" 
  alt="Preview" 
/>
```

## 📋 Supported File Types

| Type | Extensions | Max Size | MIME Types |
|------|-----------|----------|------------|
| Video | .mp4, .webm, .ogg, .mov, .avi | 500MB | video/mp4, video/webm, video/ogg, video/quicktime, video/x-msvideo |
| Audio | .mp3, .wav, .ogg, .webm | 500MB | audio/mpeg, audio/mp3, audio/wav, audio/ogg, audio/webm |
| PDF | .pdf | 500MB | application/pdf |
| Image | .jpg, .jpeg, .png, .gif, .webp | 500MB | image/jpeg, image/png, image/gif, image/webp |

## 🔒 Security

- **Authentication Required:** All upload endpoints require valid JWT token
- **Role-Based Access:** Only admin and instructor roles can upload
- **File Validation:** Only allowed file types are accepted
- **Size Limits:** Maximum file size is 500MB
- **Secure Filenames:** Original filenames are sanitized

## 📁 File Storage

Files are stored in the following directory structure:
```
uploads/
├── videos/
├── audio/
├── pdfs/
├── images/
└── thumbnails/
```

Files are accessible via:
- Direct URL: `http://localhost:3000/uploads/videos/filename.mp4`
- Preview URL: `http://localhost:3000/api/upload/preview/video/filename.mp4`

## 🚀 React Component Example

```jsx
import { useState } from 'react';

const LessonUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create local preview
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('video', file); // or 'audio', 'pdf', 'image'

    try {
      const response = await fetch('http://localhost:3000/api/upload/video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        // Use result.data.fullUrl in your course creation
        onUploadComplete(result.data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFileChange} 
      />
      
      {previewUrl && (
        <video 
          src={previewUrl} 
          controls 
          style={{ maxWidth: '100%', marginTop: '10px' }}
        />
      )}
      
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};
```

## 🔄 Complete Course Creation Flow

```javascript
// Complete example: Upload and create course
const createCourseWithUploads = async (courseData, lessonFiles) => {
  const token = localStorage.getItem('token');
  const uploadedFiles = {};

  // Step 1: Upload all lesson files
  for (const [lessonIndex, lesson] of courseData.chapters.flatMap(
    (ch, chIdx) => ch.lessons.map((l, lIdx) => ({ 
      chapterIndex: chIdx, 
      lessonIndex: lIdx, 
      lesson: l 
    }))
  ).entries()) {
    const lesson = lesson.lesson;
    
    if (lesson.type === 'VIDEO' && lessonFiles[lessonIndex]?.video) {
      const formData = new FormData();
      formData.append('video', lessonFiles[lessonIndex].video);
      
      const uploadRes = await fetch('http://localhost:3000/api/upload/video', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      
      const uploadData = await uploadRes.json();
      courseData.chapters[lesson.chapterIndex].lessons[lesson.lessonIndex].videoUrl = 
        uploadData.data.fullUrl;
    }
    
    // Similar for audio, pdf, etc.
  }

  // Step 2: Create course with file URLs
  const createRes = await fetch('http://localhost:3000/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });

  return await createRes.json();
};
```

## ⚠️ Important Notes

1. **Upload First:** Always upload files before creating the course
2. **Store URLs:** Save the returned file URLs to use in course creation
3. **Preview URLs:** Use preview endpoints for displaying content
4. **File Size:** Large files may take time to upload
5. **Error Handling:** Always handle upload errors gracefully

## 🐛 Troubleshooting

### File Upload Fails
- Check file size (max 500MB)
- Verify file type is supported
- Ensure authentication token is valid
- Check user has admin/instructor role

### Preview Not Working
- Verify file exists in uploads directory
- Check file path is correct
- Ensure server has read permissions

### CORS Issues
- Verify CORS_ORIGIN in .env includes frontend URL
- Check browser console for CORS errors

