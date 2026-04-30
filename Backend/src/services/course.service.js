import courseModel from "../models/course.model.js";
import enrollmentModel from "../models/enrollment.model.js"
import { ApiError } from "../utils/apiError.js";

// course created
export async function createCourse(data, instructorId) {
  const course = await courseModel.create({
    ...data,
    instructor: instructorId,
  });

  return course;
}

// get all courses
export async function getAllCourses({ page = 1, limit = 10, search, category, featured }) {
  const skip = (page - 1) * limit;

  // for filter functionality
  let filter = { isPublished: true };

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (category) {
    filter.category = category;
  }

  if (featured) {
  filter.isFeatured = true;
}

  const courses = await courseModel
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort({createdAt: -1});

  const total = await courseModel.countDocuments(filter);

  return {
    courses,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  };
}

// find by id
export async function getCourseById(courseId) {
  const course = await courseModel.findOne({
    _id: courseId,
    isPublished: true,
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return course;
}

// update course by id
export async function updateCourse(courseId, userId, data) {
  const course = await courseModel.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (course.instructor.toString() !== userId.toString()) {
    throw new ApiError(403, "Not allowed to update this course");
  }

  Object.assign(course, data);
  await course.save();

  return course;
}

// delete the course
export async function deleteCourse(courseId, userId) {
  const course = await courseModel.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (course.instructor.toString() !== userId.toString()) {
    throw new ApiError(403, "Not allowed to delete this course");
  }

  await course.deleteOne();

  return true;
}

// after creating course we have to add lessons in it
export async function addLesson(courseId, instructorId, lessonData) {
  const course = await courseModel.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // it is important to check that the instructor is adding lesson in his own course, not someone else's
  if (course.instructor.toString() !== instructorId.toString()) {
    throw new ApiError(403, "Not authorized");
  }


  const lesson = {
    title: lessonData.title,
    content: lessonData.content,
    videoUrl: lessonData.videoUrl,
    duration: lessonData.duration
  };

  course.lessons.push(lesson);
  await course.save();

  return course;
}

// it will publish course
export async function togglePublishCourse(courseId, instructorId) {
  const course = await courseModel.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (course.instructor.toString() !== instructorId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  // for ensuring that at least one lesson is added
  if (!course.isPublished && course.lessons.length === 0) {
    throw new ApiError(400, "Add at least one lesson before publishing");
  }

  course.isPublished = !course.isPublished;
  await course.save();

  return course;
}

// get all courses of instructor itself
export async function getInstructorCourses(instructorId) {
  return await courseModel.find(
    {
      instructor: instructorId
    }
  );
}


export async function getInstructorStats(instructorId) {
  const courses = await courseModel.find({ instructor: instructorId });

  const totalCourses = courses.length;

  const publishedCourses = courses.filter(c => c.isPublished).length;

  const courseIds = courses.map(c => c._id);

  //  get enrollments for instructor's courses
  const enrollments = await enrollmentModel.find({
    course: { $in: courseIds }
  }).populate("course");

  const totalStudents = enrollments.length;

  //  group students per course
  const map = {};

  enrollments.forEach(enr => {
    const title = enr.course.title;

    if (!map[title]) map[title] = 0;
    map[title]++;
  });

  const studentsPerCourse = Object.keys(map).map(title => ({
    title,
    students: map[title]
  }));

  return {
    totalCourses,
    publishedCourses,
    totalStudents,
    studentsPerCourse
  };
}
