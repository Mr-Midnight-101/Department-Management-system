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
      console.log(res);
      setCourseChoices(res);
      setCourseArray(res);
      setCourseError("");
    } catch (error) {
      console.log(error);
      setCourseFetchError(error?.response?.data?.message);
    }
  }, []);
  // semester
  const semesterArray = getSemesterOptionsFromCourse(courseChoice);
  useEffect(() => {
    fetchCourseList();
  }, [fetchCourseList]);

  useEffect(() => {
    fetchCourseList();
  }, [fetchCourseList]);

  // ⭐ Fetch students

  const [isfetchError, setIsFetchError] = useState(null); // Changed to null or object, not string
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
        setIsFetchError(null); // Clear any previous fetch errors
      } catch (error) {
        console.error("Error fetching students:", error);
        setIsFetchError(error); // Store the full error object for potential debugging
      }
    },
    [] // No dependency on students, so it doesn't re-create unnecessarily
  );

  useEffect(() => {
    // Only fetch students if a course is pre-selected, or if you want to fetch all students on initial load
    if (filterData) {
      fetchStudents(filterData);
    }
  }, [fetchStudents, filterData, refreshTable]); // Re-fetch when courseObj changes or table needs refresh

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
    setRegisterError({}); // Clear errors on close
    setRefreshTable((prev) => !prev); // Trigger table refresh
  };

  //!______________________________________________________delete student
  // Delete dialog state
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // Changed to null initially

  // delete Dialog open/close handlers
  const openDeleteDialog = useCallback((student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  }, []);
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

  // Register Handler
  const handleRegisterStudent = async (formData) => {
    setRegisterError({}); // Clear previous validation errors
    setRegisterLoading(true);

    const validationMsg = validateStudentForm(formData);
    if (validationMsg && Object.keys(validationMsg).length > 0) {
      setRegisterError(validationMsg);
      setRegisterLoading(false);
      return;
    }

    try {
      console.log("passing data in api after validation", formData);
      const response = await studentRegister(formData);
      if (response.status === 201) {
        closeRegisterDialog(); // Close and trigger refresh
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError((prev) => ({
        ...prev,
        apiError:
          error?.response?.data?.message ||
          error?.message ||
          "Student registration failed. Please try again.",
      }));
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
  const openUpdateDialog = useMemo((student) => {
    // Map existing student data to match form structure, especially for course ID
    setSelectedStudent({
      ...student,
      // Ensure studentCurrentCourseId is just the ID string for the select input
      studentCurrentCourseId: student?.studentCurrentCourseId?._id || "",
      // Ensure studentAddress exists for nested updates
      // studentAddress: {
      //   city: student.studentAddress?.city || "",
      //   state: student.studentAddress?.state || "",
      //   country: student.studentAddress?.country || "India", // Default country if missing
      //   postalCode: student.studentAddress?.postalCode || "",
      // },
    });
    setUpdateError({}); // Clear validation errors
    setUpdateDialogOpen(true);
  }, []);

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
      console.log("Response of API call:", updated);

      if (updated.status === 200) {
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
          console.log(params);
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
          console.log(params);
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
          const row = params.row; // Use params.row for the specific row data
          return (
            <GridActionButton
              openUpdateDialog={() => openUpdateDialog(row)}
              openDeleteDialog={() => openDeleteDialog(row)}
            />
          );
        },
      },
    ],
    [openUpdateDialog, openDeleteDialog] // Add action handlers as dependencies
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
        </Box>

        {/* DataGrid */}
        <GridWrapper
          sx={{
            width: "90vw",
          }}
          rows={students}
          columns={columns}
          // Display fetch error if any
          fetchError={
            isfetchError
              ? isfetchError.message || "Failed to fetch student data."
              : null
          }
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
              {/* Overall Error message (e.g., from server) */}
              {registerError?.apiError && (
                <Box mb={2}>
                  <Typography color="error" variant="body2">
                    {registerError.apiError}
                  </Typography>
                </Box>
              )}
              {/* Overall Validation Error from frontend */}
              {registerError?.allFields && (
                <Box mb={2}>
                  <Typography color="error" variant="body2">
                    {registerError.allFields}
                  </Typography>
                </Box>
              )}

              <FormFieldsStack>
                <TextField
                  size="small"
                  label="Full Name"
                  required
                  error={!!registerError?.studentFullName}
                  helperText={registerError?.studentFullName}
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
                  error={!!registerError?.studentDateOfBirth}
                  helperText={registerError?.studentDateOfBirth}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="studentDateOfBirth"
                  value={
                    registerForm.studentDateOfBirth
                      ? dayjs(registerForm.studentDateOfBirth).format(
                          "YYYY-MM-DD"
                        )
                      : ""
                  }
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <TextField
                  size="small"
                  label="Enrollment No."
                  required
                  error={!!registerError?.studentEnrollmentNumber}
                  helperText={registerError?.studentEnrollmentNumber}
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
                  error={!!registerError?.studentCurrentCourseId}
                  helperText={
                    registerError?.studentCurrentCourseId ||
                    (courseChoices.length === 0 && !courseError
                      ? "No courses available"
                      : "")
                  }
                  variant="outlined"
                  name="studentCurrentCourseId"
                  value={registerForm?.studentCurrentCourseId || ""}
                  onChange={(e) => {
                    setRegisterForm((prev) => ({
                      ...prev,
                      studentCurrentCourseId: e.target.value,
                    }));
                  }}
                  disabled={courseChoices.length === 0}
                >
                  {courseChoices.length > 0 ? (
                    courseChoices.map((c) => (
                      <MenuItem key={c?._id} value={c?._id}>
                        {c?.courseCode}
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
                  name="StudentCurrentSemester"
                  variant="outlined"
                  value={registerForm?.StudentCurrentSemester || ""}
                  onChange={(e) => {
                    setRegisterForm((prev) => ({
                      ...prev,
                      StudentCurrentSemester: e.target.value,
                    }));
                  }}
                  error={!!registerError?.StudentCurrentSemester}
                  helperText={registerError?.StudentCurrentSemester}
                >
                  {semesterList.map((item, idx) => (
                    <MenuItem key={item.value || idx} value={item.value}>
                      {item.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  label="Roll No."
                  required
                  error={!!registerError?.studentRollNumber}
                  helperText={registerError?.studentRollNumber}
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
                  error={!!registerError?.studentEmail}
                  helperText={registerError?.studentEmail}
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
                  error={!!registerError?.studentContactNumber}
                  helperText={registerError?.studentContactNumber}
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
                  error={!!registerError?.studentFatherName}
                  helperText={registerError?.studentFatherName}
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
                  error={!!registerError?.city}
                  helperText={registerError?.city}
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
                  error={!!registerError?.state}
                  helperText={registerError?.state}
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
                  error={!!registerError?.country}
                  helperText={registerError?.country}
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
                  error={!!registerError?.postalCode}
                  helperText={registerError?.postalCode}
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
                  error={!!registerError?.studentCategory}
                  helperText={registerError?.studentCategory}
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
                  error={!!registerError?.studentType}
                  helperText={registerError?.studentType}
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
                  error={!!registerError?.studentAdmissionYear}
                  helperText={registerError?.studentAdmissionYear}
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
              {/* Overall Error message (e.g., from server) */}
              {updateError?.apiError && (
                <Box mb={2}>
                  <Typography color="error" variant="body2">
                    {updateError.apiError}
                  </Typography>
                </Box>
              )}
              {/* Overall Validation Error from frontend */}
              {updateError?.allFields && (
                <Box mb={2}>
                  <Typography color="error" variant="body2">
                    {updateError.allFields}
                  </Typography>
                </Box>
              )}
              <FormFieldsStack>
                <TextField
                  size="small"
                  label="Full Name"
                  name="studentFullName"
                  value={selectedStudent?.studentFullName || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  error={!!updateError?.studentFullName}
                  helperText={updateError?.studentFullName}
                />
                <TextField
                  size="small"
                  type="date" // Changed type to date
                  label="DOB"
                  name="studentDateOfBirth"
                  InputLabelProps={{ shrink: true }}
                  value={
                    selectedStudent?.studentDateOfBirth
                      ? dayjs(selectedStudent.studentDateOfBirth).format(
                          "YYYY-MM-DD"
                        )
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      // Ensure date is stored correctly if your backend expects Date object or specific format
                      [e.target.name]: e.target.value,
                    }))
                  }
                  error={!!updateError?.studentDateOfBirth}
                  helperText={updateError?.studentDateOfBirth}
                />
                <TextField
                  size="small"
                  label="Enrollment"
                  name="studentEnrollmentNumber"
                  value={selectedStudent?.studentEnrollmentNumber || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  error={!!updateError?.studentEnrollmentNumber}
                  helperText={updateError?.studentEnrollmentNumber}
                />
                <TextField
                  size="small"
                  label="Course"
                  required
                  select
                  error={!!updateError?.studentCurrentCourseId}
                  helperText={
                    updateError?.studentCurrentCourseId ||
                    (courseChoices.length === 0 && !courseError
                      ? "No courses available"
                      : "")
                  }
                  variant="outlined"
                  name="studentCurrentCourseId"
                  disabled={courseChoices.length === 0}
                  value={selectedStudent?.studentCurrentCourseId || ""}
                  onChange={(e) => {
                    setSelectedStudent((prev) => ({
                      ...prev,
                      studentCurrentCourseId: e.target.value,
                    }));
                  }}
                >
                  {courseChoices.length > 0 ? (
                    courseChoices.map((c, idx) => (
                      <MenuItem key={c?._id || idx} value={c?._id}>
                        {c?.courseCode}
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
                  variant="outlined"
                  name="StudentCurrentSemester"
                  value={selectedStudent?.StudentCurrentSemester || ""}
                  onChange={(e) => {
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                  error={!!updateError?.StudentCurrentSemester}
                  helperText={updateError?.StudentCurrentSemester}
                >
                  {semesterList.map((item, idx) => (
                    <MenuItem key={item.value || idx} value={item.value}>
                      {item.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Roll no."
                  size="small"
                  name="studentRollNumber"
                  value={selectedStudent?.studentRollNumber || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  error={!!updateError?.studentRollNumber}
                  helperText={updateError?.studentRollNumber}
                />
                <TextField
                  label="Email"
                  size="small"
                  name="studentEmail"
                  value={selectedStudent?.studentEmail || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  error={!!updateError?.studentEmail}
                  helperText={updateError?.studentEmail}
                />
                <TextField
                  label="Contact Info"
                  size="small"
                  name="studentContactNumber"
                  value={selectedStudent?.studentContactNumber || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  error={!!updateError?.studentContactNumber}
                  helperText={updateError?.studentContactNumber}
                />
                <TextField
                  label="Father Name"
                  size="small"
                  name="studentFatherName"
                  value={selectedStudent?.studentFatherName || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  error={!!updateError?.studentFatherName}
                  helperText={updateError?.studentFatherName}
                />
                <TextField
                  label="City"
                  size="small"
                  name="city"
                  value={selectedStudent?.studentAddress?.city || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      studentAddress: {
                        ...prev.studentAddress,
                        [e.target.name]: e.target.value,
                      },
                    }))
                  }
                  error={!!updateError?.city}
                  helperText={updateError?.city}
                />
                <TextField
                  label="State"
                  size="small"
                  name="state"
                  value={selectedStudent?.studentAddress?.state || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      studentAddress: {
                        ...prev.studentAddress,
                        [e.target.name]: e.target.value,
                      },
                    }))
                  }
                  error={!!updateError?.state}
                  helperText={updateError?.state}
                />
                <TextField
                  size="small"
                  label="Country"
                  required
                  variant="outlined"
                  error={!!updateError?.country}
                  helperText={updateError?.country}
                  name="country"
                  value={selectedStudent?.studentAddress?.country || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      studentAddress: {
                        ...prev.studentAddress,
                        [e.target.name]: e.target.value || "India",
                      },
                    }))
                  }
                />
                <TextField
                  required
                  size="small"
                  label="Postal Code"
                  variant="outlined"
                  value={selectedStudent?.studentAddress?.postalCode || ""}
                  error={!!updateError?.postalCode}
                  helperText={updateError?.postalCode}
                  name="postalCode"
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      studentAddress: {
                        ...prev.studentAddress,
                        [e.target.name]: e.target.value,
                      },
                    }))
                  }
                />
                <TextField
                  size="small"
                  label="Category"
                  required
                  select
                  variant="outlined"
                  error={!!updateError?.studentCategory}
                  helperText={updateError?.studentCategory}
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
                  error={!!updateError?.studentType}
                  helperText={updateError?.studentType}
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
                  error={!!updateError?.studentAdmissionYear}
                  helperText={updateError?.studentAdmissionYear}
                  variant="outlined"
                  name="studentAdmissionYear"
                  value={selectedStudent.studentAdmissionYear || ""}
                  onChange={(e) =>
                    setSelectedStudent({
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
              dialogTitle="Confirm Deletion"
              dialogContent={`Are you sure you want to delete ${selectedStudent?.studentFullName}'s record? This action cannot be undone.`}
              onConfirm={handleDeleteStudent}
              onCancel={closeDeleteDialog}
            />
          </FormDialogWrapper>
        )}
      </Box>

      {/* --- */}

      {/* Snackbar for global notifications */}
      <Snackbar
        open={"snackbarOpen"}
        autoHideDuration={6000}
        onClose={"handleSnackbarClose"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={""}
          severity={"snackbarSeverity"}
          sx={{ width: "100%" }}
        >
          {""}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Students;
