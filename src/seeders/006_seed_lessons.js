const { Chapter, Lesson } = require('../models/index');

const seedLessons = async () => {
  try {
    console.log('🌱 Seeding lessons with comprehensive content...');

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

    // Sample video URLs (using sample video services)
    const sampleVideoUrls = [
      'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ];

    // Sample audio URLs
    const sampleAudioUrls = [
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
      'https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav',
      'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav',
    ];

    // Sample PDF URLs
    const samplePdfUrls = [
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      'https://www.africau.edu/images/default/sample.pdf',
      'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf',
      'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
      'https://www.orimi.com/pdf-test.pdf',
    ];

    // Sample text content for TEXT type lessons
    const sampleTextContent = {
      arabicBasics: `
# Introduction to Arabic Alphabet

## Overview
The Arabic alphabet consists of 28 letters, all of which are consonants. Arabic is written from right to left.

## Key Features
- **Direction**: Right to left
- **Script**: Cursive script where letters connect
- **Vowels**: Short vowels are represented by diacritical marks

## The 28 Letters
The Arabic alphabet includes letters such as:
- ا (Alif)
- ب (Ba)
- ت (Ta)
- ث (Tha)
- ج (Jeem)
- ح (Haa)
- خ (Khaa)

## Practice
Practice writing each letter and pronouncing it correctly. Focus on the shape of each letter in its different positions (initial, medial, final, isolated).
      `,
      grammar: `
# Arabic Grammar Basics

## Sentence Structure
Arabic follows a Verb-Subject-Object (VSO) word order in most cases, though Subject-Verb-Object (SVO) is also common.

## Nouns
- **Definite Article**: ال (al-) is used to make nouns definite
- **Gender**: All nouns are either masculine or feminine
- **Number**: Singular, dual, and plural forms exist

## Verbs
Arabic verbs are conjugated based on:
- Person (first, second, third)
- Number (singular, dual, plural)
- Gender (masculine, feminine)
- Tense (past, present, future)

## Practice Exercises
Complete the following exercises to reinforce your understanding of basic Arabic grammar.
      `,
      vocabulary: `
# Essential Arabic Vocabulary

## Greetings
- مرحبا (Marhaba) - Hello
- السلام عليكم (As-salamu alaykum) - Peace be upon you
- صباح الخير (Sabah al-khayr) - Good morning
- مساء الخير (Masa' al-khayr) - Good evening

## Common Phrases
- شكراً (Shukran) - Thank you
- من فضلك (Min fadlik) - Please
- عذراً (Uzran) - Excuse me
- مع السلامة (Ma'a as-salama) - Goodbye

## Numbers
- واحد (Wahid) - One
- اثنان (Ithnan) - Two
- ثلاثة (Thalatha) - Three
- أربعة (Arba'a) - Four
- خمسة (Khamsa) - Five
      `,
      conversation: `
# Daily Conversations

## At the Market
**Seller**: مرحبا، كيف يمكنني مساعدتك؟
(Hello, how can I help you?)

**Customer**: أريد كيلو من التفاح
(I want a kilo of apples)

**Seller**: كم تريد؟
(How much do you want?)

**Customer**: كيلو واحد، من فضلك
(One kilo, please)

## At a Restaurant
**Waiter**: مرحبا، ماذا تريد أن تأكل؟
(Hello, what would you like to eat?)

**Customer**: أريد كبسة دجاج
(I want chicken kabsa)

**Waiter**: مشروب؟
(Drink?)

**Customer**: ماء، من فضلك
(Water, please)
      `,
      quiz: `
# Quiz: Arabic Basics

## Instructions
Answer the following questions to test your understanding of Arabic basics.

## Questions
1. How many letters are in the Arabic alphabet?
2. In which direction is Arabic written?
3. What is the Arabic word for "hello"?
4. What is the definite article in Arabic?
5. How do you say "thank you" in Arabic?

## Answers
1. 28 letters
2. Right to left
3. مرحبا (Marhaba)
4. ال (al-)
5. شكراً (Shukran)
      `,
    };

    // Helper function to create lesson based on type
    const createLesson = (chapterId, title, description, order, type, chapterIndex, lessonIndex) => {
      const lesson = {
        chapterId,
        title,
        description,
        order,
        type,
        durationMinutes: type === 'QUIZ' ? 10 : (15 + Math.floor(Math.random() * 25)), // 15-40 min, quizzes shorter
        isPreview: lessonIndex === 0 && chapterIndex === 0, // First lesson of first chapter is preview
      };

      // Add content based on type
      switch (type) {
        case 'VIDEO':
          lesson.videoUrl = sampleVideoUrls[lessonIndex % sampleVideoUrls.length];
          break;
        case 'AUDIO':
          lesson.audioUrl = sampleAudioUrls[lessonIndex % sampleAudioUrls.length];
          break;
        case 'PDF':
          lesson.contentUrl = samplePdfUrls[lessonIndex % samplePdfUrls.length];
          break;
        case 'TEXT':
          const textKeys = Object.keys(sampleTextContent);
          lesson.textContent = sampleTextContent[textKeys[lessonIndex % textKeys.length]];
          break;
        case 'QUIZ':
          lesson.textContent = sampleTextContent.quiz;
          break;
      }

      return lesson;
    };

    // Create lessons for each chapter with variety of content types
    chapters.forEach((chapter, chapterIndex) => {
      const chapterTitle = chapter.title;
      
      // Define lesson structure for each chapter (mix of different types)
      const lessonTemplates = [
        { title: 'Introduction and Overview', type: 'VIDEO' },
        { title: 'Core Concepts', type: 'TEXT' },
        { title: 'Practical Examples', type: 'VIDEO' },
        { title: 'Practice Exercises', type: 'PDF' },
        { title: 'Audio Practice', type: 'AUDIO' },
        { title: 'Review and Summary', type: 'TEXT' },
        { title: 'Advanced Techniques', type: 'VIDEO' },
        { title: 'Quiz Assessment', type: 'QUIZ' },
      ];

      // Use 5-6 lessons per chapter (adjust based on course)
      const lessonsPerChapter = chapterIndex < 2 ? 6 : 5; // First 2 chapters get 6 lessons
      const templates = lessonTemplates.slice(0, lessonsPerChapter);

      templates.forEach((template, lessonIndex) => {
        const fullTitle = `${chapterTitle}: ${template.title}`;
        const description = `Learn ${template.title.toLowerCase()} in this ${template.type.toLowerCase()} lesson.`;
        
        lessons.push(createLesson(
          chapter.id,
          fullTitle,
          description,
          lessonIndex + 1,
          template.type,
          chapterIndex,
          lessonIndex
        ));
      });
    });

    await Lesson.bulkCreate(lessons);
    console.log(`✅ Seeded ${lessons.length} lessons with comprehensive content`);
    console.log(`   - Video lessons: ${lessons.filter(l => l.type === 'VIDEO').length}`);
    console.log(`   - Audio lessons: ${lessons.filter(l => l.type === 'AUDIO').length}`);
    console.log(`   - PDF lessons: ${lessons.filter(l => l.type === 'PDF').length}`);
    console.log(`   - Text lessons: ${lessons.filter(l => l.type === 'TEXT').length}`);
    console.log(`   - Quiz lessons: ${lessons.filter(l => l.type === 'QUIZ').length}`);
  } catch (error) {
    console.error('❌ Error seeding lessons:', error.message);
    throw error;
  }
};

module.exports = seedLessons;

