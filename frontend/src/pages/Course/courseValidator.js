/* eslint-disable no-unused-vars */
const courseValidator = (form) => {
  console.log("course validation form", form);

  const err = {};
  //   if (
  //     !(
  //       form?.courseCode ||
  //       form?.courseTitle ||
  //       form?.courseDuration ||
  //       form?.courseTerms ||
  //       form?.courseCreditUnits
  //     )
  //   ) {
  //     err.requiredFieldError = "All fields are required!";
  //   }

  if (!form?.courseCode) {
    err.courseCodeError = "Course code is required!";
  }

  if (!form?.courseTitle) {
    err.courseTitleError = "Course title is required!";
  }
  if (!form?.courseDuration) {
    err.courseDurationError = "Course duration is required!";
  }
  if (!form?.courseTerms) {
    err.courseTermError = "Course terms are required!";
  }
  if (!form?.courseCreditUnits) {
    err.courseCreditError = "Course credit is required!";
  }
  console.log("course validation form error", err);
  return err;
};

export default courseValidator;
