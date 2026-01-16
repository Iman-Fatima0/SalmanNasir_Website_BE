const { Course, Instructor, CourseInstructor } = require('../models/index');

const seedCourseInstructors = async () => {
  try {
    console.log('🌱 Seeding course-instructor relationships...');

    // Get all courses and instructors
    const courses = await Course.findAll();
    const instructors = await Instructor.findAll();

    if (courses.length === 0 || instructors.length === 0) {
      console.log('⚠️  No courses or instructors found. Please seed them first.');
      return;
    }

    // Check if relationships already exist
    const existingRelations = await CourseInstructor.findAll({
      limit: 1,
    });

    if (existingRelations.length > 0) {
      console.log('⚠️  Course-instructor relationships already exist, skipping...');
      return;
    }

    const courseInstructors = [];

    // Assign instructors to courses
    // Course 1: Complete Arabic Mastery - Assign 2 instructors
    if (courses[0] && instructors[0] && instructors[1]) {
      courseInstructors.push(
        { courseId: courses[0].id, instructorId: instructors[0].id }, // Dr. Khaled
        { courseId: courses[0].id, instructorId: instructors[4].id }  // Yusuf (Beginners)
      );
    }

    // Course 2: Business Arabic - Assign 1 instructor
    if (courses[1] && instructors[3]) {
      courseInstructors.push(
        { courseId: courses[1].id, instructorId: instructors[3].id } // Layla (Business)
      );
    }

    // Course 3: Classical Arabic - Assign 1 instructor
    if (courses[2] && instructors[2]) {
      courseInstructors.push(
        { courseId: courses[2].id, instructorId: instructors[2].id } // Omar (Classical)
      );
    }

    // Course 4: Levantine Arabic - Assign 1 instructor
    if (courses[3] && instructors[1]) {
      courseInstructors.push(
        { courseId: courses[3].id, instructorId: instructors[1].id } // Aisha (Modern/Levantine)
      );
    }

    // Course 5: Arabic Grammar - Assign 2 instructors
    if (courses[4] && instructors[0] && instructors[2]) {
      courseInstructors.push(
        { courseId: courses[4].id, instructorId: instructors[0].id }, // Dr. Khaled
        { courseId: courses[4].id, instructorId: instructors[2].id }  // Omar
      );
    }

    // Course 6: Arabic for Kids - Assign 1 instructor
    if (courses[5] && instructors[4]) {
      courseInstructors.push(
        { courseId: courses[5].id, instructorId: instructors[4].id } // Yusuf (Beginners/Kids)
      );
    }

    await CourseInstructor.bulkCreate(courseInstructors);
    console.log(`✅ Seeded ${courseInstructors.length} course-instructor relationships`);
  } catch (error) {
    console.error('❌ Error seeding course-instructors:', error.message);
    throw error;
  }
};

module.exports = seedCourseInstructors;

