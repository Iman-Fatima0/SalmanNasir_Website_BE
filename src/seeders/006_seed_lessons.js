const { Chapter, Lesson } = require('../models/index');

const seedLessons = async () => {
  try {
    console.log('🌱 Seeding lessons...');

    // Get all chapters grouped by course
    const chapters = await Chapter.findAll({
      order: [['courseId', 'ASC'], ['order', 'ASC']],
    });

    if (chapters.length === 0) {
      console.log('⚠️  No chapters found. Please seed chapters first.');
      return;
    }

    // Check if lessons already exist
    const existingLessons = await Lesson.findAll({
      limit: 1,
    });

    if (existingLessons.length > 0) {
      console.log('⚠️  Lessons already exist, skipping...');
      return;
    }

    const lessons = [];

    // Helper function to generate lesson titles based on chapter
    const generateLessonTitles = (chapterTitle, count) => {
      const baseTitles = [
        'Introduction and Overview',
        'Core Concepts',
        'Practical Examples',
        'Practice Exercises',
        'Advanced Techniques',
        'Review and Summary',
        'Common Mistakes',
        'Tips and Tricks',
        'Real-World Applications',
        'Final Assessment',
      ];

      return baseTitles.slice(0, count).map((title, index) => 
        `${chapterTitle}: ${title}`
      );
    };

    // Create lessons for each chapter
    // Each chapter gets 5 lessons by default
    chapters.forEach((chapter) => {
      const lessonsPerChapter = 5;
      const lessonTitles = generateLessonTitles(chapter.title, lessonsPerChapter);

      lessonTitles.forEach((title, lessonIndex) => {
        lessons.push({
          chapterId: chapter.id,
          title: title,
          description: `Learn ${title.toLowerCase()} in this comprehensive lesson.`,
          order: lessonIndex + 1,
          videoUrl: `https://example.com/videos/${chapter.id}-lesson-${lessonIndex + 1}.mp4`,
          durationMinutes: 15 + Math.floor(Math.random() * 20), // 15-35 minutes
          isPreview: lessonIndex === 0, // First lesson is preview
        });
      });
    });

    await Lesson.bulkCreate(lessons);
    console.log(`✅ Seeded ${lessons.length} lessons`);
  } catch (error) {
    console.error('❌ Error seeding lessons:', error.message);
    throw error;
  }
};

module.exports = seedLessons;

