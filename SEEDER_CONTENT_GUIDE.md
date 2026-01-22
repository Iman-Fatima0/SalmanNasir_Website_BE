# Seeder Content Guide - Comprehensive Course Data

## 📚 Overview

The lesson seeder (`006_seed_lessons.js`) has been updated to include **comprehensive content** with all lesson types:
- ✅ **VIDEO** lessons with video URLs
- ✅ **AUDIO** lessons with audio URLs  
- ✅ **PDF** lessons with PDF document URLs
- ✅ **TEXT** lessons with rich text content
- ✅ **QUIZ** lessons with quiz questions

---

## 🎯 Content Types Included

### 1. **VIDEO Lessons**
- **Field**: `videoUrl`
- **Sample URLs**: Uses sample video services for testing
- **Examples**:
  - Big Buck Bunny sample videos
  - Elephant's Dream
  - Other sample MP4 files

### 2. **AUDIO Lessons**
- **Field**: `audioUrl`
- **Sample URLs**: Uses sample audio files
- **Examples**:
  - SoundHelix music samples
  - WAV audio files
  - MP3 audio files

### 3. **PDF Lessons**
- **Field**: `contentUrl`
- **Sample URLs**: Uses sample PDF documents
- **Examples**:
  - W3C sample PDFs
  - Adobe sample PDFs
  - Test PDF files

### 4. **TEXT Lessons**
- **Field**: `textContent`
- **Content**: Rich markdown-formatted text with:
  - Headings and subheadings
  - Arabic vocabulary
  - Grammar explanations
  - Practice exercises
  - Examples and translations

### 5. **QUIZ Lessons**
- **Field**: `textContent` (quiz questions and answers)
- **Content**: Quiz format with:
  - Instructions
  - Questions
  - Answer key

---

## 📊 Lesson Distribution

Each chapter gets **5-6 lessons** with a mix of content types:

1. **Introduction and Overview** → VIDEO
2. **Core Concepts** → TEXT
3. **Practical Examples** → VIDEO
4. **Practice Exercises** → PDF
5. **Audio Practice** → AUDIO
6. **Review and Summary** → TEXT
7. **Advanced Techniques** → VIDEO
8. **Quiz Assessment** → QUIZ

---

## 🚀 How to Use

### 1. **Reset and Reseed (if lessons already exist)**

If you want to regenerate lessons with the new comprehensive content:

```bash
# Option 1: Delete existing lessons manually
# In your database or using Sequelize CLI

# Option 2: Modify the seeder to allow re-seeding
# Change the check in 006_seed_lessons.js:
# if (existingLessons.length > 0) {
#   console.log('⚠️  Lessons already exist, skipping...');
#   return;
# }
# To:
# if (existingLessons.length > 0) {
#   console.log('⚠️  Deleting existing lessons...');
#   await Lesson.destroy({ where: {} });
# }
```

### 2. **Run the Seeder**

```bash
# Run all seeders (recommended)
npm run seed

# Or run specific seeder
node src/seeders/006_seed_lessons.js
```

### 3. **Verify the Data**

After seeding, you should see output like:
```
✅ Seeded 300 lessons with comprehensive content
   - Video lessons: 120
   - Audio lessons: 60
   - PDF lessons: 60
   - Text lessons: 50
   - Quiz lessons: 10
```

---

## 📝 Sample Content Examples

### TEXT Lesson Example
```markdown
# Introduction to Arabic Alphabet

## Overview
The Arabic alphabet consists of 28 letters...

## Key Features
- **Direction**: Right to left
- **Script**: Cursive script...

## The 28 Letters
- ا (Alif)
- ب (Ba)
- ت (Ta)
...
```

### QUIZ Lesson Example
```markdown
# Quiz: Arabic Basics

## Questions
1. How many letters are in the Arabic alphabet?
2. In which direction is Arabic written?
...

## Answers
1. 28 letters
2. Right to left
...
```

---

## 🔍 Viewing the Content

### Via API Endpoints

1. **Get Course with Lessons:**
   ```
   GET /api/courses/:id
   ```
   Returns course with chapters and lessons including all content fields.

2. **Get Student Course:**
   ```
   GET /api/student/courses/:id
   ```
   Returns enrolled course with all lesson content.

### Content Fields in Response

```json
{
  "lessons": [
    {
      "id": "lesson-id",
      "title": "Introduction to Arabic: Introduction and Overview",
      "type": "VIDEO",
      "videoUrl": "https://sample-videos.com/...",
      "durationMinutes": 25,
      "isPreview": true
    },
    {
      "id": "lesson-id-2",
      "title": "Introduction to Arabic: Core Concepts",
      "type": "TEXT",
      "textContent": "# Introduction to Arabic Alphabet\n\n## Overview...",
      "durationMinutes": 20,
      "isPreview": false
    },
    {
      "id": "lesson-id-3",
      "title": "Introduction to Arabic: Practice Exercises",
      "type": "PDF",
      "contentUrl": "https://www.w3.org/.../dummy.pdf",
      "durationMinutes": 30,
      "isPreview": false
    }
  ]
}
```

---

## 🎨 Frontend Display Recommendations

### For VIDEO Lessons
```javascript
if (lesson.type === 'VIDEO') {
  return <VideoPlayer src={lesson.videoUrl} />;
}
```

### For AUDIO Lessons
```javascript
if (lesson.type === 'AUDIO') {
  return <AudioPlayer src={lesson.audioUrl} />;
}
```

### For PDF Lessons
```javascript
if (lesson.type === 'PDF') {
  return <iframe src={lesson.contentUrl} />;
  // Or: <a href={lesson.contentUrl} download>Download PDF</a>
}
```

### For TEXT Lessons
```javascript
if (lesson.type === 'TEXT') {
  return <MarkdownRenderer content={lesson.textContent} />;
}
```

### For QUIZ Lessons
```javascript
if (lesson.type === 'QUIZ') {
  return <QuizComponent content={lesson.textContent} />;
}
```

---

## 📋 Content Summary

- **Total Lessons**: ~300+ (varies by number of chapters)
- **Video Lessons**: ~40% of total
- **Text Lessons**: ~20% of total
- **PDF Lessons**: ~20% of total
- **Audio Lessons**: ~15% of total
- **Quiz Lessons**: ~5% of total

---

## ⚠️ Important Notes

1. **Sample URLs**: The URLs provided are sample/test URLs. Replace them with your actual content URLs in production.

2. **Text Content**: Text content is in Markdown format. Your frontend should render it using a Markdown renderer.

3. **Preview Lessons**: Only the first lesson of the first chapter is marked as `isPreview: true`.

4. **Duration**: Lessons have random durations between 15-40 minutes (quizzes are shorter at ~10 minutes).

5. **Content Variety**: Each chapter has a mix of different content types to demonstrate all possibilities.

---

## 🔄 Updating Content

To add more realistic content:

1. **Replace Sample URLs**: Update the `sampleVideoUrls`, `sampleAudioUrls`, and `samplePdfUrls` arrays with your actual content URLs.

2. **Enhance Text Content**: Add more detailed text content in the `sampleTextContent` object.

3. **Add More Quiz Questions**: Expand the quiz content in `sampleTextContent.quiz`.

---

## ✅ Testing Checklist

- [ ] Run seeder successfully
- [ ] Verify all lesson types are created
- [ ] Check video URLs are accessible (or use test URLs)
- [ ] Check PDF URLs are accessible
- [ ] Verify text content displays correctly
- [ ] Test quiz content format
- [ ] Verify preview lesson is set correctly
- [ ] Check API responses include all content fields

---

## 🎯 Next Steps

1. **Run the seeder** to populate your database
2. **Test API endpoints** to see the content structure
3. **Update frontend** to handle all content types
4. **Replace sample URLs** with your actual content URLs
5. **Customize text content** for your specific courses

---

**Happy Seeding! 🌱**
