# 📁 File Upload Quick Reference

## Upload Endpoints

```
POST /api/upload/video     - Upload video file
POST /api/upload/audio     - Upload audio file
POST /api/upload/pdf       - Upload PDF file
POST /api/upload/image     - Upload image file
POST /api/upload/lesson    - Upload multiple lesson files
```

## Preview Endpoints

```
GET /api/upload/preview/video/:filename
GET /api/upload/preview/audio/:filename
GET /api/upload/preview/pdf/:filename
GET /api/upload/preview/image/:filename
```

## Frontend Integration

### Upload File
```javascript
const formData = new FormData();
formData.append('video', file); // or 'audio', 'pdf', 'image'

const response = await fetch('/api/upload/video', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const { data } = await response.json();
// Use data.fullUrl in course creation
```

### Preview Content
```html
<!-- Video -->
<video src="/api/upload/preview/video/filename.mp4" controls />

<!-- Audio -->
<audio src="/api/upload/preview/audio/filename.mp3" controls />

<!-- PDF -->
<iframe src="/api/upload/preview/pdf/filename.pdf" />

<!-- Image -->
<img src="/api/upload/preview/image/filename.jpg" />
```

## Lesson Types

- `VIDEO` - Use `videoUrl` field
- `AUDIO` - Use `audioUrl` field
- `PDF` - Use `contentUrl` field
- `TEXT` - Use `textContent` field
- `QUIZ` - Use `textContent` or `contentUrl` for quiz JSON

## File Limits

- Max size: 500MB
- Supported formats: See FILE_UPLOAD_GUIDE.md

