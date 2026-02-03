# Displaying Lesson Content on the Learn Page

The API **`GET /api/student/courses/:id`** returns each lesson with a **`type`** and the right content field. Use `lesson.type` to choose how to render; only one content field is populated per type.

---

## Lesson object from API

Each item in `course.chapters[].lessons[]` looks like:

```json
{
  "id": "lesson-uuid",
  "title": "Lesson title",
  "description": "...",
  "order": 1,
  "durationMinutes": 15,
  "isPreview": false,
  "type": "VIDEO",
  "videoUrl": "https://... or /uploads/videos/...",
  "audioUrl": null,
  "contentUrl": null,
  "textContent": null
}
```

- **`type`** is one of: `"VIDEO"`, `"AUDIO"`, `"PDF"`, `"TEXT"`, `"QUIZ"`.
- For **VIDEO** use `videoUrl`; for **AUDIO** use `audioUrl`; for **PDF** use `contentUrl`; for **TEXT** and **QUIZ** use `textContent`.
- Media URLs are returned as **absolute** (e.g. `http://localhost:YOUR_API_PORT/uploads/...`) so the frontend can use them as-is.

---

## How to render by type

Render the **current lesson** by switching on `lesson.type` and using the matching field below.

### 1. VIDEO (`lesson.type === 'VIDEO'`)

- **Content field:** `lesson.videoUrl`
- **Display:** Video player (e.g. `<video>` or embed).

**Example (React):**
```jsx
{lesson.type === 'VIDEO' && lesson.videoUrl && (
  <video
    controls
    src={lesson.videoUrl}
    className="w-full max-w-2xl rounded-lg"
  >
    Your browser does not support the video tag.
  </video>
)}
```

---

### 2. AUDIO (`lesson.type === 'AUDIO'`)

- **Content field:** `lesson.audioUrl`
- **Display:** Audio player.

**Example (React):**
```jsx
{lesson.type === 'AUDIO' && lesson.audioUrl && (
  <audio controls src={lesson.audioUrl} className="w-full max-w-md">
    Your browser does not support the audio tag.
  </audio>
)}
```

---

### 3. PDF (`lesson.type === 'PDF'`)

- **Content field:** `lesson.contentUrl`
- **Display:** PDF viewer (iframe) or download link.

**Example (React) – iframe:**
```jsx
{lesson.type === 'PDF' && lesson.contentUrl && (
  <iframe
    src={lesson.contentUrl}
    title={lesson.title}
    className="w-full h-[600px] rounded-lg border"
  />
)}
```

**Alternative – link only:**
```jsx
{lesson.type === 'PDF' && lesson.contentUrl && (
  <a
    href={lesson.contentUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline"
  >
    Open PDF: {lesson.title}
  </a>
)}
```

---

### 4. TEXT (`lesson.type === 'TEXT'`)

- **Content field:** `lesson.textContent`
- **Display:** Rendered text (e.g. Markdown or HTML). If you store Markdown, use a Markdown renderer; if HTML, use `dangerouslySetInnerHTML` only with sanitized content.

**Example (React) – plain / Markdown:**
```jsx
{lesson.type === 'TEXT' && lesson.textContent && (
  <div className="prose max-w-none dark:prose-invert">
    {/* If Markdown: use react-markdown or similar */}
    <ReactMarkdown>{lesson.textContent}</ReactMarkdown>
  </div>
)}
```

**Example – HTML (only if content is trusted/sanitized):**
```jsx
{lesson.type === 'TEXT' && lesson.textContent && (
  <div
    className="prose max-w-none"
    dangerouslySetInnerHTML={{ __html: lesson.textContent }}
  />
)}
```

---

### 5. QUIZ (`lesson.type === 'QUIZ'`)

- **Content field:** `lesson.textContent` (instructions or intro text).
- **Display:** Show `textContent` as instructions; if you have a separate quiz API (questions/answers), use it for the actual quiz UI. Until then, showing the text is enough.

**Example (React):**
```jsx
{lesson.type === 'QUIZ' && (
  <div className="space-y-4">
    {lesson.textContent && (
      <div className="prose max-w-none">
        <ReactMarkdown>{lesson.textContent}</ReactMarkdown>
      </div>
    )}
    {/* Optional: load quiz questions from your quiz API here */}
  </div>
)}
```

---

## Single block for the learn page

Use one conditional block that covers all types so **only one** content type is shown per lesson:

```jsx
function LessonContent({ lesson }) {
  if (!lesson) return null;

  if (lesson.type === 'VIDEO' && lesson.videoUrl) {
    return (
      <video controls src={lesson.videoUrl} className="w-full max-w-2xl rounded-lg">
        Your browser does not support the video tag.
      </video>
    );
  }

  if (lesson.type === 'AUDIO' && lesson.audioUrl) {
    return (
      <audio controls src={lesson.audioUrl} className="w-full max-w-md">
        Your browser does not support the audio tag.
      </audio>
    );
  }

  if (lesson.type === 'PDF' && lesson.contentUrl) {
    return (
      <iframe
        src={lesson.contentUrl}
        title={lesson.title}
        className="w-full h-[600px] rounded-lg border"
      />
    );
  }

  if ((lesson.type === 'TEXT' || lesson.type === 'QUIZ') && lesson.textContent) {
    return (
      <div className="prose max-w-none">
        <ReactMarkdown>{lesson.textContent}</ReactMarkdown>
      </div>
    );
  }

  return <p className="text-gray-500">No content available for this lesson.</p>;
}
```

---

## Checklist for your learn page

1. **Data:** You load course with `GET /api/student/courses/:id` (with auth). Current lesson = one item from `chapters[].lessons[]`.
2. **Branch on `lesson.type`:** Use the exact strings `'VIDEO'`, `'AUDIO'`, `'PDF'`, `'TEXT'`, `'QUIZ'`.
3. **Use the right field:**
   - VIDEO → `lesson.videoUrl`
   - AUDIO → `lesson.audioUrl`
   - PDF → `lesson.contentUrl`
   - TEXT / QUIZ → `lesson.textContent`
4. **URLs:** Use `videoUrl`, `audioUrl`, and `contentUrl` as-is (they are absolute).
5. **Fallback:** If `type` is unknown or the content field is empty, show a message like “No content available for this lesson.”

After implementing these branches, video, audio, PDF, text, and quiz content will all display on the user side.
