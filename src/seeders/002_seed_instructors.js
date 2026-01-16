const { Instructor } = require('../models/index');

const seedInstructors = async () => {
  try {
    console.log('🌱 Seeding instructors...');

    const instructors = [
      {
        firstName: 'Dr. Khaled',
        lastName: 'Al-Mansouri',
        title: 'Professor of Arabic Linguistics',
        bio: 'Dr. Khaled Al-Mansouri is a renowned Arabic language expert with over 20 years of teaching experience. He holds a Ph.D. in Arabic Linguistics from Cairo University and has published numerous research papers on Arabic language acquisition.',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        linkedinUrl: 'https://linkedin.com/in/khaled-almansouri',
        twitterUrl: 'https://twitter.com/khaled_almansouri',
        websiteUrl: 'https://khaledalmansouri.com',
        isActive: true,
      },
      {
        firstName: 'Aisha',
        lastName: 'Al-Zahra',
        title: 'Modern Arabic Language Instructor',
        bio: 'Aisha Al-Zahra specializes in teaching Modern Standard Arabic and Levantine dialects. With 15 years of experience, she has helped thousands of students achieve fluency in Arabic communication.',
        avatarUrl: 'https://i.pravatar.cc/150?img=47',
        linkedinUrl: 'https://linkedin.com/in/aisha-alzahra',
        twitterUrl: 'https://twitter.com/aisha_alzahra',
        isActive: true,
      },
      {
        firstName: 'Omar',
        lastName: 'Ibn Rashid',
        title: 'Classical Arabic & Quranic Studies Expert',
        bio: 'Omar Ibn Rashid is an expert in Classical Arabic and Quranic studies. He has taught at prestigious Islamic universities and authored several books on Arabic grammar and literature.',
        avatarUrl: 'https://i.pravatar.cc/150?img=33',
        linkedinUrl: 'https://linkedin.com/in/omar-ibn-rashid',
        websiteUrl: 'https://omaribnrashid.com',
        isActive: true,
      },
      {
        firstName: 'Layla',
        lastName: 'Al-Farsi',
        title: 'Business Arabic & Professional Communication',
        bio: 'Layla Al-Farsi focuses on Business Arabic and professional communication. She has worked with multinational corporations and helps professionals master Arabic for business contexts.',
        avatarUrl: 'https://i.pravatar.cc/150?img=20',
        linkedinUrl: 'https://linkedin.com/in/layla-alfarsi',
        isActive: true,
      },
      {
        firstName: 'Yusuf',
        lastName: 'Al-Mahmoud',
        title: 'Arabic for Beginners Specialist',
        bio: 'Yusuf Al-Mahmoud specializes in teaching Arabic to absolute beginners. His patient and structured approach has helped countless students start their Arabic learning journey successfully.',
        avatarUrl: 'https://i.pravatar.cc/150?img=51',
        linkedinUrl: 'https://linkedin.com/in/yusuf-almahmoud',
        isActive: true,
      },
    ];

    // Check if instructors already exist
    const existingInstructors = await Instructor.findAll({
      limit: 1,
    });

    if (existingInstructors.length > 0) {
      console.log('⚠️  Instructors already exist, skipping...');
      return;
    }

    await Instructor.bulkCreate(instructors);
    console.log(`✅ Seeded ${instructors.length} instructors`);
  } catch (error) {
    console.error('❌ Error seeding instructors:', error.message);
    throw error;
  }
};

module.exports = seedInstructors;

