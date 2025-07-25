// utils/semesterMapper.js

const numberMap = {
  1: "First",
  2: "Second",
  3: "Third",
  4: "Fourth",
  5: "Fifth",
  6: "Sixth",
  7: "Seventh",
  8: "Eighth",
  9: "Ninth",
  10: "Tenth",
};

/**
 * Returns an array of semester names based on either:
 * - course.semester: "six", "eight" (legacy)
 * - course.durationInYears: 2, 3, 4 (preferred)
 *
 * @param {Object} course - A course object, optionally containing `semester` or `durationInYears`
 * @returns {string[]} Array of semester labels
 */
export const getSemesterOptionsFromCourse = (course) => {
  let totalSemesters = 0;

  // Priority: Use durationInYears if provided
  if (course?.courseDuration && typeof course.courseDuration === "number") {
    totalSemesters = course.courseDuration * 2;
  }

  return Array.from({ length: totalSemesters }, (_, i) => numberMap[i + 1]);
};
