import { asyncHandler } from "../utils/asyncHandler.js";
import Apiresponse from "../utils/Apiresponse.js";
import ApiError from "../utils/ApiError.js";
import { Teacher } from "../models/teacher.model.js";
import { Student } from "../models/student.model.js";
import { Course } from "../models/course.model.js";
import { Subject } from "../models/subject.model.js";
import { Attendance } from "../models/attendence.model.js";

const documents = asyncHandler(async (req, res) => {
  try {
    const teachers = await Teacher.countDocuments();
    const students = await Student.countDocuments();
    const attendance = await Attendance.countDocuments();
    const courses = await Course.countDocuments();
    const subjects = await Subject.countDocuments();
    if (
      [
        teachers,
        students,
        attendance,
        subjects,
        courses,
      ].some((count) => count === "")
    ) {
      throw new ApiError(404, "Can not fetch data");
    }
    res.status(200).json(
      new Apiresponse(
        200,
        {
          teachers,
          students,
          subjects,
          courses,
          attendance,
        },
        "Data fetched successfully"
      )
    );
  } catch (error) {
    console.log(error);
  }
});
export { documents };
