/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import PageSectionWrapper from "../../components/PageSectionWrapper.jsx";
import GridWrapper from "../../components/GridWrapper.jsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { filterStudent, getStudents } from "../../services/student.js";
import { getSemesterOptionsFromCourse } from "../Students/utils/semesterMapper.js";
import { courseList } from "../../services/course.js";
import { getColorTokens } from "../../theme/theme.js";
import GridHeaderWithAction from "../../components/GridHeaderWithAction.jsx";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { getAttendanceBYFilter } from "../../services/attendance.js";

const Attendance = () => {
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);

  // student
  const [StudentArray, setStudentArray] = useState([]);
  const [isDataFetched, setDataFetched] = useState(false);
  const [studentName, setSTudentName] = useState({});
  const fetchStudent = useCallback(async (filter) => {
    console.log("filter", filter);

    try {
      const res = await getAttendanceBYFilter(filter).then(
        (data) => data?.data?.data
      );
      const mappedRow = res.map((student, i) => ({
        ...student,
        id: student._id || i,
        index: i + 1,
        attendanceCourse: student?.attendanceCourse?.courseCode,
      }));
      console.log(mappedRow);

      setStudentArray(mappedRow);
    } catch (error) {
      console.log(error);
    }
  }, []);
  //courseList and semestter
  const [courseArray, setCourseArray] = useState([]);
  const [courseFetchError, setCourseFetchError] = useState("");
  const [courseChoice, setCourseChoice] = useState({});
  const [filter, setFilter] = useState({});
  const semesterArray = getSemesterOptionsFromCourse(courseChoice);
  const fetchCourseList = useCallback(async () => {
    try {
      const res = await courseList().then((data) => data?.data?.data);
      setCourseArray(res);
      setCourseFetchError("");
    } catch (error) {
      setCourseFetchError(error?.response?.data?.message);
    }
  }, []);
  // semester
  useEffect(() => {
    fetchCourseList();
    fetchStudent();
  }, [fetchCourseList, fetchStudent]);

  const findBycourseAndSemester = async (filter) => {};

  const column = useMemo(
    () => [
      {
        headerName: "S. no.",
        field: "index",
      },
      {
        headerName: "Name",
        field: "attendanceStudent",
      },
      {
        headerName: "Recorded By",
        field: "attendanceRecordedBy",
        renderCell: (params) => {},
      },
      {
        headerName: "Course",
        field: "attendanceCourse",
      },
      {
        headerName: "Subject",
        field: "attendanceSubject",
        renderCell: (params) => {
          const selectedRow = params.row;
          return <></>;
        },
      },
      {
        headerName: "Semester",
        field: "attendanceSemester",
      },
      {
        headerName: "Date",
        field: "attendanceDate",
      },
      {
        headerName: "Status",
        field: "attendanceStatus",
      },
    ],
    []
  );
  return (
    <Box width="100%">
      <PageSectionWrapper>
        {/* Header and Add Student Button */}
        <GridHeaderWithAction
          pageTitle={`Attendance Monitoring System`}
          // onButtonClick={openRegisterDialog}
          buttonLabel={"Register student"}
        />
        {/* filter list*/}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              sm: "row",
              lg: "row",
            },
            gap: 2,
            mt: 4,
          }}
        >
          {/* studentCurrentSemester */}
          <TextField
            sx={{ width: 200 }}
            name="studentCurrentCourseId"
            label="Course"
            select
            value={filter?.studentCurrentCourseId || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedCourse = courseArray.find(
                (course) => course._id === selectedId
              );
              setFilter({
                ...filter,
                studentCurrentCourseId: selectedId,
                studentCurrentSemester: "",
              });
              setCourseChoice(selectedCourse);
            }}
          >
            {courseArray.map((course) => (
              <MenuItem key={course._id} value={course._id}>
                <Typography>{course.courseCode}</Typography>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            sx={{ width: 200 }}
            name="studentCurrentSemester"
            label="Semester"
            select
            value={filter?.studentCurrentSemester || ""}
            onChange={(e) => {
              setFilter({
                ...filter,
                studentCurrentSemester: e.target.value,
              });
            }}
          >
            {semesterArray.map((sem) => (
              <MenuItem key={sem} value={sem}>
                <Typography>{sem}</Typography>
              </MenuItem>
            ))}
          </TextField>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  sx={{
                    width: {
                      sm: "160px",
                    },
                  }}
                  defaultValue={dayjs(new Date())}
                  label="Basic date picker"
                  onChange={(e) =>
                    console.log(dayjs(e.$d).format("YYYY/MM/DD"))
                  }
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Button
            onClick={() => {
              findBycourseAndSemester(filter);
            }}
            sx={{
              display: "flex",
              gap: 1,
              border: `1px solid ${colors.grey[700]}`,
              px: 2,
              alignItems: "center",
            }}
          >
            <SearchIcon sx={{ color: colors.grey[700] }} />
            <Typography
              color={colors.text[100]}
              sx={{
                display: {
                  xs: "none",
                  lg: "flex",
                },
                textTransform: "capitalize",
              }}
            >
              {" "}
              {"Search"}
            </Typography>
          </Button>
          <Button
            onClick={() => setFilter({})}
            sx={{
              display: "flex",
              gap: 1,
              border: `1px solid ${colors.grey[700]}`,
              px: 2,
              alignItems: "center",
            }}
          >
            <Typography
              color={colors.text[100]}
              sx={{
                textTransform: "capitalize",
              }}
            >
              {" "}
              {"Clear"}
            </Typography>
          </Button>
        </Box>{" "}
        <GridWrapper
          columns={column}
          rows={StudentArray}
          isDatafetched={!isDataFetched}
        />
      </PageSectionWrapper>
    </Box>
  );
};

export default Attendance;
