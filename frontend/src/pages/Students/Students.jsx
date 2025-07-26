/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
//date setup
import dayjs from "dayjs";

//MUI import
import { getColorTokens } from "../../theme/theme";
import {
  Box,
  Typography,
  Button,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  useTheme,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";

// Validation function (can be reused for both register and update)
import validateStudentForm from "./utils/validateStudentForm.js"; // Ensure this returns an object like { fieldName: "Error message", allFields: "Overall error" }

//API calls
import {
  deleteStudent,
  filterStudent,
  studentRegister,
  updateStudentDetails,
} from "../../services/student.js";
import { semesterList } from "../../utils/SemesterList.js";
//drop down options
import { categoryOptions, studentTypeOptions } from "./utils/dropDownItems.js";
import GridActionButton from "../../components/GridActionButton.jsx";
import GridHeaderWithAction from "../../components/GridHeaderWithAction.jsx";
import GridWrapper from "../../components/GridWrapper.jsx";
import PageSectionWrapper from "../../components/PageSectionWrapper.jsx";
import FormDialogWrapper from "../../components/FormDialogWrapper.jsx";
import FormFieldsStack from "../../components/FormFieldsStack.jsx";
import DeleteConfirmationDialogContent from "../../components/DeleteConfirmationDialogContent.jsx";
import { courseList } from "../../services/course.js";
import { getSemesterOptionsFromCourse } from "./utils/semesterMapper.js";
const Students = () => {
  // theme setup
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);

  // Data and dialog state
  const [refreshTable, setRefreshTable] = useState(false);

  // ⭐ Course list fetching
  const [courseChoices, setCourseChoices] = useState([]);
  const [courseError, setCourseError] = useState(""); // This is for fetch error, not validation

  const [filterData, setFilterData] = useState({});

  // courseList
  const [courseChoice, setCourseChoice] = useState({});
  const [courseFetchError, setCourseFetchError] = useState("");
  const [courseArray, setCourseArray] = useState([]);
  const fetchCourseList = useCallback(async () => {
    try {
      const res = await courseList().then((data) => data?.data?.data);
      setCourseChoices(res);
      setCourseArray(res);
      setCourseError("");
    } catch (error) {
      setCourseFetchError(error?.response?.data?.message);
    }
  }, []);
  // semester
  const semesterArray = getSemesterOptionsFromCourse(courseChoice);
  useEffect(() => {
    fetchCourseList();
  }, [fetchCourseList]);

  // ⭐ Fetch students

  const [isfetchError, setIsFetchError] = useState(""); // Changed to null or object, not string
  const [students, setStudents] = useState([]);
  const fetchStudents = useCallback(
    async (filterData) => {
      try {
        // Decide whether to filter or get all students based on courseIdToFilter
        const data = await filterStudent(filterData).then(
          (res) => res?.data?.data
        );

        const mappedRows = data.map((student, i) => ({
          ...student,
          id: student._id || i, // Ensure a unique ID for DataGrid
          index: i + 1,
          // Flatten address properties for direct column access if needed
          city: student.studentAddress?.city || "",
          state: student.studentAddress?.state || "",
          country: student.studentAddress?.country || "",
          postalCode: student.studentAddress?.postalCode || "",
        }));
        setStudents(mappedRows);
        setIsFetchError(""); // Clear any previous fetch errors
      } catch (error) {
        setIsFetchError(error?.response?.data?.message); // Store the full error object for potential debugging
      }
    },
    [] // No dependency on students, so it doesn't re-create unnecessarily
  );

  // Register Dialog open/close handlers
  const openRegisterDialog = () => {
    setRegisterForm({
      studentAddress: { country: "India" },
    }); // Reset form, set default country
    setRegisterError({}); // Clear validation errors
    setRegisterDialogOpen(true);
  };
  const closeRegisterDialog = () => {
    setRegisterDialogOpen(false);
    setRegisterLoading(false);
    setRegisterError({}); // Clear errors on close
    setRefreshTable((prev) => !prev); // Trigger table refresh
  };

  //!______________________________________________________delete student
  // Delete dialog state
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // Changed to null initially

  // delete Dialog open/close handlers
  const openDeleteDialog = (student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = useCallback(() => {
    setSelectedStudent(null); // Clear selected student on close
    setDeleteDialogOpen(false);
    setRefreshTable((prev) => !prev); // Trigger table refresh
  }, []);

  //*_________________________________________________________ CRUD handlers

  //!__________________________________________________________Register student
  // Register dialog state
  const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    studentAddress: { country: "India" },
  });
  // Error and loading state for registration
  const [registerError, setRegisterError] = useState({}); // Stores validation errors as an object
  const [registerLoading, setRegisterLoading] = useState(false);
  const [isRegisterApiError, setRegisterApiError] = useState("");
  // Register Handler
  const handleRegisterStudent = async (formData) => {
    console.log(formData);

    setRegisterError({}); // Clear previous validation errors
    setRegisterLoading(true);
    const validationMsg = validateStudentForm(formData);
    if (validationMsg && Object.keys(validationMsg).length > 0) {
      setRegisterError(validationMsg);
      setRegisterLoading(false);
      return;
    }

    try {
      const response = await studentRegister(formData);
      if (response.status === 201) {
        closeRegisterDialog(); // Close and trigger refresh
      }
    } catch (error) {
      console.log("error in api call ", error);
      setRegisterApiError(error?.response?.data?.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  //!______________________________________________________update student
  // Update dialog state
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateError, setUpdateError] = useState({}); // Stores validation errors as an object
  const [updateLoading, setUpdateLoading] = useState(false);

  // update Dialog open/close handlers
  const openUpdateDialog = (student) => {
    // Map existing student data to match form structure, especially for course ID
    setSelectedStudent({
      ...student,
      // Ensure studentCurrentCourseId is just the ID string for the select input
      studentCurrentCourseId: student?.studentCurrentCourseId?._id || "",
      // Ensure studentAddress exists for nested updates
      studentAddress: {
        city: student.studentAddress?.city || "",
        state: student.studentAddress?.state || "",
        country: student.studentAddress?.country || "India", // Default country if missing
        postalCode: student.studentAddress?.postalCode || "",
      },
    });
    setUpdateError({}); // Clear validation errors
    setUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setSelectedStudent(null);
    setUpdateDialogOpen(false);
    setUpdateError({}); // Clear errors on close
    setRefreshTable((prev) => !prev); // Trigger table refresh
  };

  const handleUpdateStudent = async (student) => {
    setUpdateError({}); // Clear previous validation errors
    setUpdateLoading(true);

    const validationMsg = validateStudentForm(student);
    if (validationMsg && Object.keys(validationMsg).length > 0) {
      setUpdateError(validationMsg);
      setUpdateLoading(false);
      return;
    }

    try {
      const updated = await updateStudentDetails(student);
      console.log("updated", updated);

      if (updated.statusCode === 200) {
        // Assuming 200 OK for updates
        closeUpdateDialog(); // Close and trigger refresh
      }
    } catch (error) {
      console.error("Update error:", error);
      setUpdateError((prev) => ({
        ...prev,
        apiError:
          error?.response?.data?.message ||
          error?.message ||
          "Student update failed. Please try again.",
      }));
    } finally {
      setUpdateLoading(false);
    }
  };

  // Delete Handler
  const handleDeleteStudent = useCallback(async () => {
    console.log("handleDeleteStudent", selectedStudent);

    if (!selectedStudent || !selectedStudent._id) {
      console.error("No student selected for deletion.");
      return;
    }
    try {
      const response = await deleteStudent(selectedStudent._id); // Assuming deleteStudent takes the ID

      // Assuming 200 OK for successful deletion
      closeDeleteDialog(); // Close the dialog and trigger table refresh
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  }, [selectedStudent, closeDeleteDialog]);

  // DataGrid columns
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
      {
        field: "studentFullName",
        headerName: "Full Name",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "studentDateOfBirth",
        headerName: "DOB",
        headerAlign: "center",
        align: "left",
        valueFormatter: (params) => {
          // Format date for display if it's not already
          return params.value
            ? dayjs(params.value).format("YYYY-MM-DD")
            : "N/A";
        },
      },
      {
        field: "studentEnrollmentNumber",
        headerName: "Enrollment No.",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "studentRollNumber",
        headerName: "Roll No.",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "studentCurrentCourseId",
        headerName: "Course",
        headerAlign: "center",
        align: "left",
        // Use valueGetter to display courseCode from the nested object
        valueGetter: (params) => {
          if (params === null) {
            return "N/A";
          } else {
            return params.value?.courseCode || "N/A";
          }
        },
      },
      {
        field: "studentEmail",
        headerName: "Email",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "studentContactNumber",
        headerName: "Contact No.",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "studentFatherName",
        headerName: "Father's Name",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "city",
        headerName: "City",
        headerAlign: "center",
        align: "left",
        // Access directly as `city` is flattened in mappedRows
      },
      {
        field: "state",
        headerName: "State",
        headerAlign: "center",
        align: "left",
        // Access directly as `state` is flattened in mappedRows
      },
      {
        field: "studentCategory",
        headerName: "Category",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "studentType",
        headerName: "Type",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "action",
        headerName: "Actions",
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const row = params.row;
          console.log("e from render cell", row);
          // Use params.row for the specific row data
          return (
            <GridActionButton
              selectedRow={row}
              openUpdateDialog={() => openUpdateDialog(row)}
              openDeleteDialog={() => openDeleteDialog(row)}
            />
          );
        },
      },
    ],
    [] // Add action handlers as dependencies
  );

  return (
    <Box width="100%" maxHeight="80vh">
      <PageSectionWrapper>
        {/* Header and Add Student Button */}
        <GridHeaderWithAction
          pageTitle={`Enrolled Students`}
          onButtonClick={openRegisterDialog}
          buttonLabel={"Register student"}
        />
        {/* filter list*/}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
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
            value={filterData?.studentCurrentCourseId || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedCourse = courseArray.find(
                (course) => course._id === selectedId
              );
              setFilterData({
                ...filterData,
                studentCurrentCourseId: selectedId,
                studentCurrentSemester: "",
              });
              setCourseChoice(selectedCourse); // for semester mapping
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
            value={filterData?.studentCurrentSemester || ""}
            onChange={(e) => {
              setFilterData({
                ...filterData,
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
          <Button
            onClick={() => {
              fetchStudents(filterData);
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
                textTransform: "capitalize",
              }}
            >
              {" "}
              {"Search"}
            </Typography>
          </Button>
          <Button
            onClick={() => setFilterData({})}
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
        </Box>

        {/* DataGrid */}
        <GridWrapper
          sx={{
            width: "90vw",
          }}
          rows={students}
          columns={columns}
          isDatafetched={!isfetchError}
        />
      </PageSectionWrapper>

      {/* --- */}

      {/* Register Dialog */}
      <Box>
        {isRegisterDialogOpen && (
          <FormDialogWrapper
            isDialogOpen={isRegisterDialogOpen}
            closeDialog={closeRegisterDialog}
            dialogHeading={"Register Student"}
          >
            <DialogContent>
              <FormFieldsStack>
                <TextField
                  size="small"
                  label="Full Name"
                  required
                  error={!!registerError?.nameError}
                  helperText={registerError?.nameError}
                  variant="outlined"
                  name="studentFullName"
                  value={registerForm?.studentFullName || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Date of birth"
                  type="date"
                  required
                  error={!!registerError?.dobError}
                  helperText={registerError?.dobError}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="studentDateOfBirth"
                  value={registerForm?.studentDateOfBirth}
                  onChange={(e) => {
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: e.target.value,
                    });
                    console.log(e.target.value);
                  }}
                />
                <TextField
                  size="small"
                  label="Enrollment No."
                  required
                  error={!!registerError?.enrollError}
                  helperText={registerError?.enrollError}
                  variant="outlined"
                  name="studentEnrollmentNumber"
                  value={registerForm.studentEnrollmentNumber || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Course"
                  required
                  select
                  error={!!registerError?.courseError}
                  helperText={
                    registerError?.courseError ||
                    (courseChoices.length === 0 && !courseError
                      ? "No courses available"
                      : "")
                  }
                  variant="outlined"
                  name="studentCurrentCourseId"
                  value={registerForm?.studentCurrentCourseId || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedCourse = courseArray.find(
                      (course) => course._id === selectedId
                    );
                    setRegisterForm({
                      ...registerForm,
                      studentCurrentCourseId: selectedId,
                      studentCurrentSemester: "",
                    });
                    setCourseChoice(selectedCourse);
                  }}
                  disabled={courseChoices.length === 0}
                >
                  {courseArray.length > 0 ? (
                    courseArray.map((course) => (
                      <MenuItem key={course._id} value={course._id}>
                        <Typography>{course.courseCode}</Typography>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      {courseError || "Loading courses..."}
                    </MenuItem>
                  )}
                </TextField>
                <TextField
                  label="Semester"
                  size="small"
                  select
                  name="studentCurrentSemester"
                  variant="outlined"
                  value={registerForm?.studentCurrentSemester || ""}
                  onChange={(e) => {
                    setRegisterForm({
                      ...registerForm,
                      studentCurrentSemester: e.target.value,
                    });
                  }}
                  error={!!registerError?.semError}
                  helperText={registerError?.semError}
                >
                  {semesterArray.map((sem) => {
                    return (
                      <MenuItem key={sem} value={sem}>
                        <Typography>{sem}</Typography>
                      </MenuItem>
                    );
                  })}
                </TextField>
                <TextField
                  size="small"
                  label="Roll No."
                  required
                  error={!!registerError?.rollError}
                  helperText={registerError?.rollError}
                  variant="outlined"
                  name="studentRollNumber"
                  value={registerForm.studentRollNumber || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  type="email"
                  label="Email ID"
                  required
                  error={!!registerError?.emailError}
                  helperText={registerError?.emailError}
                  variant="outlined"
                  name="studentEmail"
                  value={registerForm.studentEmail || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Contact"
                  required
                  error={!!registerError?.contactError}
                  helperText={registerError?.contactError}
                  variant="outlined"
                  name="studentContactNumber"
                  value={registerForm.studentContactNumber || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Father's Name"
                  error={!!registerError?.fnameError}
                  helperText={registerError?.fnameError}
                  required
                  variant="outlined"
                  name="studentFatherName"
                  value={registerForm.studentFatherName || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="City"
                  required
                  variant="outlined"
                  error={!!registerError?.cityError}
                  helperText={registerError?.cityError}
                  name="city"
                  value={registerForm?.studentAddress?.city || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      studentAddress: {
                        ...registerForm.studentAddress,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                />
                <TextField
                  size="small"
                  label="State"
                  required
                  error={!!registerError?.stateError}
                  helperText={registerError?.stateError}
                  variant="outlined"
                  name="state"
                  value={registerForm?.studentAddress?.state || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      studentAddress: {
                        ...registerForm.studentAddress,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Country"
                  required
                  variant="outlined"
                  error={!!registerError?.countryError}
                  helperText={registerError?.countryError}
                  name="country"
                  value={registerForm?.studentAddress?.country || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      studentAddress: {
                        ...registerForm.studentAddress,
                        [e.target.name]: e.target.value || "India",
                      },
                    })
                  }
                />
                <TextField
                  required
                  size="small"
                  label="Postal Code"
                  variant="outlined"
                  value={registerForm?.studentAddress?.postalCode || ""}
                  error={!!registerError?.postalCodeError}
                  helperText={registerError?.postalCodeError}
                  name="postalCode"
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      studentAddress: {
                        ...registerForm.studentAddress,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Category"
                  required
                  select
                  variant="outlined"
                  error={!!registerError?.categoryErro}
                  helperText={registerError?.categoryErro}
                  name="studentCategory"
                  value={registerForm.studentCategory || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                >
                  {categoryOptions.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  size="small"
                  label="Student Type"
                  required
                  error={!!registerError?.studentTypeError}
                  helperText={registerError?.studentTypeError}
                  select
                  variant="outlined"
                  name="studentType"
                  value={registerForm?.studentType || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                >
                  {studentTypeOptions.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  type="number"
                  label="Admission Year"
                  required
                  error={!!registerError?.admissionYearError}
                  helperText={registerError?.admissionYearError}
                  variant="outlined"
                  name="studentAdmissionYear"
                  value={registerForm.studentAdmissionYear || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: Number(e.target.value),
                    })
                  }
                />
              </FormFieldsStack>
            </DialogContent>
            <DialogActions
              sx={{
                "& :hover": {
                  backgroundColor: colors.blue[100],
                },
              }}
            >
              <Button
                onClick={() => handleRegisterStudent(registerForm)}
                sx={{
                  color: colors.text[100],
                  background: colors.green[100],
                }}
                disabled={registerLoading}
              >
                <Typography variant="h5">
                  {registerLoading ? "Registering..." : "Register"}
                </Typography>
              </Button>
            </DialogActions>
          </FormDialogWrapper>
        )}
      </Box>

      {/* --- */}

      {/* Update Dialog */}
      <Box>
        {isUpdateDialogOpen && selectedStudent && (
          <FormDialogWrapper
            isDialogOpen={isUpdateDialogOpen}
            closeDialog={closeUpdateDialog}
            dialogHeading={"Update student"}
          >
            <DialogContent>
              <FormFieldsStack>
                <TextField
                  size="small"
                  label="Full Name"
                  required
                  error={!!updateError?.nameError}
                  helperText={updateError?.nameError}
                  variant="outlined"
                  name="studentFullName"
                  value={selectedStudent?.studentFullName || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Date of birth"
                  type="date"
                  required
                  error={!!updateError?.dobError}
                  helperText={updateError?.dobError}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="studentDateOfBirth"
                  value={selectedStudent?.studentDateOfBirth}
                  onChange={(e) => {
                    setSelectedStudent({
                      ...selectedStudent,
                      [e.target.name]: e.target.value,
                    });
                    console.log(e.target.value);
                  }}
                />
                <TextField
                  size="small"
                  label="Enrollment No."
                  required
                  error={!!updateError?.enrollError}
                  helperText={updateError?.enrollError}
                  variant="outlined"
                  name="studentEnrollmentNumber"
                  value={selectedStudent.studentEnrollmentNumber || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Course"
                  required
                  select
                  error={!!updateError?.courseError}
                  helperText={
                    updateError?.courseError ||
                    (courseArray.length === 0 && !courseError
                      ? "No courses available"
                      : "")
                  }
                  variant="outlined"
                  name="studentCurrentCourseId"
                  value={selectedStudent?.studentCurrentCourseId || ""}
                  onChange={(e) => {
                    console.log("event", e);

                    const selectedId = e.target.value;
                    const selectedCourse = courseArray.find(
                      (course) => course._id === selectedId
                    );
                    setSelectedStudent({
                      ...selectedStudent,
                      studentCurrentCourseId: selectedId,
                      studentCurrentSemester: "",
                    });
                    setCourseChoice(selectedCourse);
                  }}
                  disabled={courseChoices.length === 0}
                >
                  {courseArray.length > 0 ? (
                    courseArray.map((course) => (
                      <MenuItem key={course._id} value={course._id}>
                        <Typography>{course.courseCode}</Typography>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      {courseError || "Loading courses..."}
                    </MenuItem>
                  )}
                </TextField>
                <TextField
                  label="Semester"
                  size="small"
                  select
                  name="studentCurrentSemester"
                  variant="outlined"
                  value={selectedStudent?.studentCurrentSemester || ""}
                  onChange={(e) => {
                    setSelectedStudent({
                      ...selectedStudent,
                      studentCurrentSemester: e.target.value,
                    });
                  }}
                  error={!!updateError?.semError}
                  helperText={updateError?.semError}
                >
                  {semesterArray.map((sem) => {
                    return (
                      <MenuItem key={sem} value={sem}>
                        <Typography>{sem}</Typography>
                      </MenuItem>
                    );
                  })}
                </TextField>
                <TextField
                  size="small"
                  label="Roll No."
                  required
                  error={!!updateError?.rollError}
                  helperText={updateError?.rollError}
                  variant="outlined"
                  name="studentRollNumber"
                  value={selectedStudent.studentRollNumber || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  type="email"
                  label="Email ID"
                  required
                  error={!!updateError?.emailError}
                  helperText={updateError?.emailError}
                  variant="outlined"
                  name="studentEmail"
                  value={selectedStudent.studentEmail || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Contact"
                  required
                  error={!!updateError?.contactError}
                  helperText={updateError?.contactError}
                  variant="outlined"
                  name="studentContactNumber"
                  value={selectedStudent.studentContactNumber || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Father's Name"
                  error={!!updateError?.fnameError}
                  helperText={updateError?.fnameError}
                  required
                  variant="outlined"
                  name="studentFatherName"
                  value={selectedStudent.studentFatherName || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="City"
                  required
                  variant="outlined"
                  error={!!updateError?.cityError}
                  helperText={updateError?.cityError}
                  name="city"
                  value={selectedStudent?.studentAddress?.city || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      studentAddress: {
                        ...selectedStudent.studentAddress,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                />
                <TextField
                  size="small"
                  label="State"
                  required
                  error={!!updateError?.stateError}
                  helperText={updateError?.stateError}
                  variant="outlined"
                  name="state"
                  value={selectedStudent?.studentAddress?.state || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      studentAddress: {
                        ...selectedStudent.studentAddress,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Country"
                  required
                  variant="outlined"
                  error={!!updateError?.countryError}
                  helperText={updateError?.countryError}
                  name="country"
                  value={selectedStudent?.studentAddress?.country || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      studentAddress: {
                        ...selectedStudent.studentAddress,
                        [e.target.name]: e.target.value || "India",
                      },
                    })
                  }
                />
                <TextField
                  required
                  size="small"
                  label="Postal Code"
                  variant="outlined"
                  value={selectedStudent?.studentAddress?.postalCode || ""}
                  error={!!updateError?.postalCodeError}
                  helperText={updateError?.postalCodeError}
                  name="postalCode"
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      studentAddress: {
                        ...selectedStudent.studentAddress,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Category"
                  required
                  select
                  variant="outlined"
                  error={!!updateError?.categoryErro}
                  helperText={updateError?.categoryErro}
                  name="studentCategory"
                  value={selectedStudent.studentCategory || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [e.target.name]: e.target.value,
                    })
                  }
                >
                  {categoryOptions.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  size="small"
                  label="Student Type"
                  required
                  error={!!updateError?.studentTypeError}
                  helperText={updateError?.studentTypeError}
                  select
                  variant="outlined"
                  name="studentType"
                  value={selectedStudent?.studentType || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      [e.target.name]: e.target.value,
                    })
                  }
                >
                  {studentTypeOptions.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  type="number"
                  label="Admission Year"
                  required
                  error={!!updateError?.admissionYearError}
                  helperText={updateError?.admissionYearError}
                  variant="outlined"
                  name="studentAdmissionYear"
                  value={selectedStudent.studentAdmissionYear || ""}
                  onChange={(e) =>
                    setRegisterForm({
                      ...selectedStudent,
                      [e.target.name]: Number(e.target.value),
                    })
                  }
                />
              </FormFieldsStack>
            </DialogContent>
            <DialogActions
              sx={{
                "& :hover": {
                  backgroundColor: colors.blue[100],
                },
              }}
            >
              <Button
                onClick={() => handleUpdateStudent(selectedStudent)}
                sx={{
                  color: colors.text[100],
                  background: colors.green[100],
                }}
                disabled={updateLoading}
              >
                <Typography variant="h5">
                  {updateLoading ? "Updating..." : "Update"}
                </Typography>
              </Button>
            </DialogActions>
          </FormDialogWrapper>
        )}
      </Box>

      {/* --- */}

      {/* Delete Confirmation Dialog */}
      <Box>
        {isDeleteDialogOpen && selectedStudent && (
          <FormDialogWrapper
            isDialogOpen={isDeleteDialogOpen}
            closeDialog={closeDeleteDialog}
            dialogHeading={"Confirm Deletion"}
          >
            <DeleteConfirmationDialogContent
              entityName={selectedStudent?.studentFullName}
              onConfirm={handleDeleteStudent}
              onCancel={closeDeleteDialog}
            />
          </FormDialogWrapper>
        )}
      </Box>

      {/* --- */}

      {/* Snackbar for global notifications */}
      <Snackbar
        open={!!isRegisterApiError}
        autoHideDuration={2000}
        onClose={() => setRegisterApiError((prev) => !prev)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {isRegisterApiError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Students;
