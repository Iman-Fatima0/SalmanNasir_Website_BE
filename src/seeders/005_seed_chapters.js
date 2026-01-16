const { Course, Chapter } = require('../models/index');

const seedChapters = async () => {
  try {
    console.log('🌱 Seeding chapters...');

    // Get all courses
    const courses = await Course.findAll({
      order: [['id', 'ASC']],
    });

    if (courses.length === 0) {
      console.log('⚠️  No courses found. Please seed courses first.');
      return;
    }

    // Check if chapters already exist
    const existingChapters = await Chapter.findAll({
      limit: 1,
    });

    if (existingChapters.length > 0) {
      console.log('⚠️  Chapters already exist, skipping...');
      return;
    }

    const chapters = [];

    // Course 1: Complete Arabic Mastery Program (10 chapters)
    if (courses[0]) {
      const course1Chapters = [
        { courseId: courses[0].id, title: 'Introduction to Arabic', description: 'Learn the Arabic alphabet, pronunciation, and basic greetings.', order: 1 },
        { courseId: courses[0].id, title: 'Basic Vocabulary', description: 'Essential words and phrases for everyday communication.', order: 2 },
        { courseId: courses[0].id, title: 'Arabic Grammar Basics', description: 'Introduction to Arabic sentence structure and grammar rules.', order: 3 },
        { courseId: courses[0].id, title: 'Present Tense Verbs', description: 'Master the present tense conjugation in Arabic.', order: 4 },
        { courseId: courses[0].id, title: 'Past Tense Verbs', description: 'Learn past tense verbs and their usage.', order: 5 },
        { courseId: courses[0].id, title: 'Future Tense', description: 'Understanding future tense and expressing future actions.', order: 6 },
        { courseId: courses[0].id, title: 'Numbers and Counting', description: 'Arabic numerals and counting systems.', order: 7 },
        { courseId: courses[0].id, title: 'Daily Conversations', description: 'Practice common daily conversation scenarios.', order: 8 },
        { courseId: courses[0].id, title: 'Reading and Writing', description: 'Develop reading and writing skills in Arabic.', order: 9 },
        { courseId: courses[0].id, title: 'Advanced Communication', description: 'Complex sentences and advanced communication skills.', order: 10 },
      ];
      chapters.push(...course1Chapters);
    }

    // Course 2: Business Arabic (8 chapters)
    if (courses[1]) {
      const course2Chapters = [
        { courseId: courses[1].id, title: 'Business Greetings and Introductions', description: 'Professional greetings and introduction protocols.', order: 1 },
        { courseId: courses[1].id, title: 'Business Vocabulary', description: 'Essential business terminology in Arabic.', order: 2 },
        { courseId: courses[1].id, title: 'Email and Written Communication', description: 'Writing professional emails and business letters.', order: 3 },
        { courseId: courses[1].id, title: 'Meetings and Presentations', description: 'Conducting meetings and giving presentations in Arabic.', order: 4 },
        { courseId: courses[1].id, title: 'Negotiations', description: 'Business negotiation language and strategies.', order: 5 },
        { courseId: courses[1].id, title: 'Contracts and Agreements', description: 'Understanding business contracts in Arabic.', order: 6 },
        { courseId: courses[1].id, title: 'Cultural Business Etiquette', description: 'Cultural norms and business etiquette in Arab countries.', order: 7 },
        { courseId: courses[1].id, title: 'Case Studies', description: 'Real-world business scenarios and case studies.', order: 8 },
      ];
      chapters.push(...course2Chapters);
    }

    // Course 3: Classical Arabic (12 chapters)
    if (courses[2]) {
      const course3Chapters = [
        { courseId: courses[2].id, title: 'Introduction to Classical Arabic', description: 'Overview of Classical Arabic and its historical significance.', order: 1 },
        { courseId: courses[2].id, title: 'Classical Arabic Grammar', description: 'Fundamental grammar rules of Classical Arabic.', order: 2 },
        { courseId: courses[2].id, title: 'Quranic Arabic Basics', description: 'Introduction to Quranic text and vocabulary.', order: 3 },
        { courseId: courses[2].id, title: 'Verb Forms and Patterns', description: 'Understanding Arabic verb forms (أوزان).', order: 4 },
        { courseId: courses[2].id, title: 'Noun Declensions', description: 'Case endings and noun declensions in Classical Arabic.', order: 5 },
        { courseId: courses[2].id, title: 'Reading Classical Texts', description: 'Reading and analyzing classical Arabic literature.', order: 6 },
        { courseId: courses[2].id, title: 'Quranic Exegesis', description: 'Understanding Quranic verses and their meanings.', order: 7 },
        { courseId: courses[2].id, title: 'Classical Poetry', description: 'Introduction to classical Arabic poetry.', order: 8 },
        { courseId: courses[2].id, title: 'Hadith Studies', description: 'Understanding Hadith terminology and structure.', order: 9 },
        { courseId: courses[2].id, title: 'Rhetoric and Eloquence', description: 'Arabic rhetoric (بلاغة) and eloquence.', order: 10 },
        { courseId: courses[2].id, title: 'Advanced Grammar', description: 'Advanced grammatical concepts in Classical Arabic.', order: 11 },
        { courseId: courses[2].id, title: 'Textual Analysis', description: 'Advanced analysis of classical Arabic texts.', order: 12 },
      ];
      chapters.push(...course3Chapters);
    }

    // Course 4: Levantine Arabic (9 chapters)
    if (courses[3]) {
      const course4Chapters = [
        { courseId: courses[3].id, title: 'Introduction to Levantine Dialect', description: 'Overview of Levantine Arabic and its characteristics.', order: 1 },
        { courseId: courses[3].id, title: 'Basic Levantine Phrases', description: 'Essential phrases for daily communication.', order: 2 },
        { courseId: courses[3].id, title: 'Levantine Grammar', description: 'Grammar specific to Levantine Arabic.', order: 3 },
        { courseId: courses[3].id, title: 'Food and Dining', description: 'Food vocabulary and dining expressions.', order: 4 },
        { courseId: courses[3].id, title: 'Shopping and Markets', description: 'Shopping vocabulary and market conversations.', order: 5 },
        { courseId: courses[3].id, title: 'Travel and Transportation', description: 'Travel-related vocabulary and expressions.', order: 6 },
        { courseId: courses[3].id, title: 'Family and Relationships', description: 'Talking about family and relationships.', order: 7 },
        { courseId: courses[3].id, title: 'Cultural Context', description: 'Understanding cultural nuances in Levantine Arabic.', order: 8 },
        { courseId: courses[3].id, title: 'Advanced Conversations', description: 'Complex conversations in Levantine Arabic.', order: 9 },
      ];
      chapters.push(...course4Chapters);
    }

    // Course 5: Arabic Grammar (15 chapters)
    if (courses[4]) {
      const course5Chapters = [
        { courseId: courses[4].id, title: 'Introduction to Arabic Grammar', description: 'Overview of Arabic grammar system.', order: 1 },
        { courseId: courses[4].id, title: 'Nouns and Articles', description: 'Understanding Arabic nouns and definite articles.', order: 2 },
        { courseId: courses[4].id, title: 'Adjectives and Agreement', description: 'Adjectives and their agreement with nouns.', order: 3 },
        { courseId: courses[4].id, title: 'Pronouns', description: 'Personal, possessive, and demonstrative pronouns.', order: 4 },
        { courseId: courses[4].id, title: 'Verbs - Present Tense', description: 'Present tense verb conjugation.', order: 5 },
        { courseId: courses[4].id, title: 'Verbs - Past Tense', description: 'Past tense verb conjugation.', order: 6 },
        { courseId: courses[4].id, title: 'Verbs - Future Tense', description: 'Future tense and expressing future actions.', order: 7 },
        { courseId: courses[4].id, title: 'Verb Forms', description: 'Arabic verb forms (أوزان) and their meanings.', order: 8 },
        { courseId: courses[4].id, title: 'Prepositions', description: 'Common prepositions and their usage.', order: 9 },
        { courseId: courses[4].id, title: 'Conjunctions', description: 'Connecting words and conjunctions.', order: 10 },
        { courseId: courses[4].id, title: 'Sentence Structure', description: 'Arabic sentence patterns and word order.', order: 11 },
        { courseId: courses[4].id, title: 'Conditional Sentences', description: 'If-then structures and conditional clauses.', order: 12 },
        { courseId: courses[4].id, title: 'Relative Clauses', description: 'Relative pronouns and relative clauses.', order: 13 },
        { courseId: courses[4].id, title: 'Passive Voice', description: 'Understanding passive voice in Arabic.', order: 14 },
        { courseId: courses[4].id, title: 'Advanced Grammar Topics', description: 'Complex grammatical structures and rules.', order: 15 },
      ];
      chapters.push(...course5Chapters);
    }

    // Course 6: Arabic for Kids (6 chapters)
    if (courses[5]) {
      const course6Chapters = [
        { courseId: courses[5].id, title: 'Arabic Alphabet Fun', description: 'Learning the Arabic alphabet through games and songs.', order: 1 },
        { courseId: courses[5].id, title: 'Colors and Shapes', description: 'Learning colors and shapes in Arabic.', order: 2 },
        { courseId: courses[5].id, title: 'Animals and Nature', description: 'Animal names and nature vocabulary.', order: 3 },
        { courseId: courses[5].id, title: 'Family and Friends', description: 'Talking about family members and friends.', order: 4 },
        { courseId: courses[5].id, title: 'Daily Activities', description: 'Describing daily activities and routines.', order: 5 },
        { courseId: courses[5].id, title: 'Stories and Songs', description: 'Learning through Arabic stories and songs.', order: 6 },
      ];
      chapters.push(...course6Chapters);
    }

    await Chapter.bulkCreate(chapters);
    console.log(`✅ Seeded ${chapters.length} chapters`);
  } catch (error) {
    console.error('❌ Error seeding chapters:', error.message);
    throw error;
  }
};

module.exports = seedChapters;

