/* eslint-disable no-unused-vars */
import { Box, IconButton, TextField, Typography } from "@mui/material";
import PageSectionWrapper from "../../components/PageSectionWrapper.jsx";
import GridWrapper from "../../components/GridWrapper.jsx";
import { useMemo, useState } from "react";
import { filterStudent } from "../../services/student.js";

const Attendance = () => {
  const [rows, setRows] = useState([]);
  const [course, setCourse] = useState([]);
  const [semester, setSemester] = useState([]);

  const columns = useMemo(
    () => [
      {
        field: "index",
        headerName: "S.No.",
        headerAlign: "center",
        align: "left",
        width: 80,
        maxWidth: 80,
      },
      {},
    ],
    []
  );
  const [fetchError, setIsFetchError] = useState("");
  const [courseError, setCourseError] = useState("");
  const [filter, setFilter] = useState({});
  const [filterError, setFilterError] = useState({});
  const [filterCourseList, setFilterCourse] = useState([]);
  const [students, setStudents] = useState({});
  const [semesterList, setList] = useState([]);
  const findBycourse = async (filter) => {
    setIsFetchError("");
    setFilterError("");
    setStudents([]);
    console.log(filter);

    try {
      const apiCall = await filterStudent(filter).then((res) => {
        console.log("response ", res?.data?.data);
        return res?.data?.data;
      });
      const mappedRow = apiCall.map((student, i) => ({
        ...student,
        id: student._id || i,
        index: i + 1,
        ...student.studentAddress,
        city: student.studentAddress?.city || "",
        state: student.studentAddress?.state || "",
      }));
      console.log(mappedRow);

      setStudents(mappedRow);
    } catch (error) {
      console.log(error?.response?.data?.message);
      setFilterError(error?.response?.data?.message);
      setStudents([]);
      setIsFetchError(error?.response?.data?.message);
    }
  };
  return (
    <Box width="100%">
      <PageSectionWrapper>
        <Box display="flex" gap={1} alignItems="center" width="100%">
          <Box> Search student: </Box>
          <Box display="flex" gap={1}>
            <TextField
              size="medium"
              label="Course"
              placeholder="Course"
              required
              select
              error={!!filterError?.filterCourse} // Assuming registerError.courseError exists for validation
              helperText={
                filterError?.filterCourse ||
                (filterCourseList.length === 0 && !courseError
                  ? "No courses available"
                  : "")
              }
              variant="outlined"
              name="courseName"
              value={filter?.courseName || ""}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  courseName: e.target.value,
                }));
              }}
              sx={{
                width: "100px",
                // background: colors.ArtyClick[100],
              }}
              disabled={filterCourseList.length === 0 && !courseError}
            >
              {/* IMPORTANT: Only MenuItem children allowed */}
              {filterCourseList.length > 0 &&
                filterCourseList.map((course) => (
                  <MenuItem key={course?._id} value={course?._id}>
                    {course?.courseCode}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              sx={{
                width: "100px",
                // background: colors.ArtyClick[100],
              }}
              label="Semester"
              size="medium"
              select
              name="semester"
              variant="outlined"
              value={filter?.semester || ""}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  semester: e.target.value,
                }));
              }}
            >
              {semesterList.map((sem, idx) => (
                <MenuItem key={sem.value || idx} value={sem.value}>
                  {sem.value}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <IconButton
            onClick={() => {
              findBycourse(filter);
            }}
          >
            <SearchIcon />
          </IconButton>
          <Button
            onClick={() => {
              setFilter("");
            }}
          >
            Clear
          </Button>
        </Box>
        <GridWrapper columns={columns} rows={rows}></GridWrapper>
      </PageSectionWrapper>
    </Box>
  );
};

export default Attendance;
