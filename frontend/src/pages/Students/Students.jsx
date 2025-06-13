/* eslint-disable no-unused-vars */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
} from "@mui/material";

// Validation function (can be reused for both register and
import validateStudentForm from "./utils/validateStudentForm.js";

//API calls
import {
  deleteStudent,
  getStudents,
  studentRegister,
  updateStudentDetails,
} from "../../services/student.js";

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
const Students = () => {
  //render
  const renderCount = useRef(1);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`Rendered ${renderCount.current} times`);
  });

  //theme setup
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);

  // Data and dialog state
  const [refreshTable, setRefreshTable] = useState(false);

  // ⭐ course list fetching
  const [courseChoices, setCourseChoices] = useState([]);
  const [courseError, setCourseError] = useState("");
  const fetchCourseList = useCallback(async () => {
    try {
      const list = await courseList();
      const mappedlist = list?.data?.data;
      setCourseChoices(mappedlist);
    } catch (error) {
      setCourseError(error?.response?.data?.message);
    }
  }, []);

  // ⭐ Fetch students
  const [isDatafetched, setDatafetched] = useState(false);
  const [isfetchError, setIsFetchError] = useState(null);
  const [students, setStudents] = useState([]);
  const fetchStudents = useCallback(async () => {
    try {
      const data = await getStudents();
      const mappedRows = data.map((student, i) => ({
        ...student,
        id: student._id || i,
        index: i + 1,
        ...student.studentAddress,
        city: student.studentAddress?.city || "",
        state: student.studentAddress?.state || "",
      }));
      setDatafetched(true);
      setStudents(mappedRows);
    } catch (error) {
      console.error("Error fetching students:", error);
      setIsFetchError(error);
    }
  }, []);

  useEffect(() => {
    fetchCourseList();
    fetchStudents();
  }, [fetchStudents, refreshTable, fetchCourseList]);

  const studentList = React.memo(students);
  React.memo(courseChoices);
  // Register Dialog open/close handlers
  const openRegisterDialog = () => {
    setRegisterForm({}); // Reset the form fields
    setRegisterDialogOpen(true);
  };
  const closeRegisterDialog = () => {
    setRegisterDialogOpen(false);
    setRegisterError({});
    setRefreshTable((prev) => !prev);
  };

  //!______________________________________________________delete student
  // Delete dialog state
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // delete Dialog open/close handlers
  const openDeleteDialog = (student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRefreshTable((prev) => !prev);
  };

  //*_________________________________________________________ CRUD handlers

  //!__________________________________________________________Register student
  // Register dialog state
  const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({});
  // Error and loading state for registration
  const [registerError, setRegisterError] = useState({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const [controllerError, setControllerError] = useState("");
  // Register Handler
  const handleRegisterStudent = async (formData) => {
    setRegisterError({});
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
        setRegisterError({});
        setRefreshTable(true);
        closeRegisterDialog();
      }
    } catch (error) {
      setControllerError(error?.response?.data?.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  // Update Handler
  //!______________________________________________________update student
  // Update dialog state
  const [selectedStudent, setSelectedStudent] = useState({});
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);

  //  Error and loading state for updation
  const [updateError, setUpdateError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // update Dialog open/close handlers
  const openUpdateDialog = (student) => {
    setSelectedStudent({
      ...student,
      studentCurrentCourseId: student?.studentCurrentCourseId?._id || "",
    });
    setUpdateDialogOpen(true);
  };
  const closeUpdateDialog = () => {
    setSelectedStudent({});
    setUpdateDialogOpen(false);
    setRefreshTable((prev) => !prev);
  };
  const handleUpdateStudent = async (student) => {
    setUpdateError("");
    setUpdateLoading(true);
    const validationMsg = validateStudentForm(student);
    if (validationMsg && Object.keys(validationMsg).length > 0) {
      setUpdateError(validationMsg);
      setUpdateLoading(false);
      return;
    }
    try {
      const updated = await updateStudentDetails(student);
      console.log("REsponse of api call", updated);

      if (updated.status === 201) {
        setRefreshTable(true);
        setUpdateError({});
      }
      closeUpdateDialog(); // This will toggle refreshTable
    } catch (error) {
      setUpdateError(
        error?.response?.data?.message ||
          error?.message ||
          "Update failed. Please try again."
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  // Delete Handler
  const handleDeleteStudent = useCallback(() => {
    async (student) => {
      try {
        const response = await deleteStudent(student);
        if (!response) console.error("Failed to delete student");
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    };
  }, []);

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

        valueGetter: (params) => {
          if (!params) {
            return "N/A";
          }
          return params?.courseCode;
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
          const selectedRow = params.row;
          return (
            <GridActionButton
              openUpdateDialog={() => openUpdateDialog(selectedRow)}
              openDeleteDialog={() => openDeleteDialog(selectedRow)}
              selectedRow={studentList}
            />
          );
        },
      },
    ],
    [studentList]
  );

  return (
    <Box width="100%" maxheight="80vh">
      <PageSectionWrapper>
        {/* Header and Add Student Button */}
        <GridHeaderWithAction
          pageTitle={"Student Records"}
          onButtonClick={openRegisterDialog}
          buttonLabel={"Add Student"}
        />

        {/* DataGrid */}
        <GridWrapper
          sx={{
            width: "90vw",
          }}
          isDatafetched={isDatafetched}
          rows={students}
          columns={columns}
        />
      </PageSectionWrapper>
      {/* Register Dialog */}
      <Box>
        {isRegisterDialogOpen && (
          <Box>
            <FormDialogWrapper
              isDialogOpen={isRegisterDialogOpen}
              closeDialog={closeRegisterDialog}
              dialogHeading={"Register Student"}
            >
              <DialogContent>
                {/* Error message */}
                {registerError && (
                  <Box mb={2}>
                    <Typography color="error" variant="body2">
                      {registerError?.allFields}
                    </Typography>
                  </Box>
                )}

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
                      shrink: true, // still valid and needed
                    }}
                    name="studentDateOfBirth"
                    value={registerForm.studentDateOfBirth || ""}
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
                    error={!!registerError?.courseError} // Assuming registerError.courseError exists for validation
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
                      setRegisterForm((prev) => ({
                        ...prev,
                        studentCurrentCourseId: e.target.value,
                      }));
                    }}
                    disabled={courseChoices.length === 0 && !courseError}
                  >
                    {/* IMPORTANT: Only MenuItem children allowed */}
                    {courseChoices.length > 0 &&
                      courseChoices.map((c) => (
                        <MenuItem key={c?._id} value={c?._id}>
                          {c?.courseCode}
                        </MenuItem>
                      ))}
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
                    require="true"
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
                    error={!!registerError?.categoryError}
                    helperText={registerError?.categoryError}
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
              <Box
                gap={1}
                alignItems="center"
                display="flex"
                justifyContent="center"
                flexDirection="column"
              >
                {controllerError && (
                  <Box mb={2}>
                    <Typography color="error" variant="body2">
                      {controllerError}
                    </Typography>
                  </Box>
                )}
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
              </Box>
            </FormDialogWrapper>
          </Box>
        )}
      </Box>

      {/* Update Dialog */}
      <Box>
        {isUpdateDialogOpen && selectedStudent && (
          <FormDialogWrapper
            isDialogOpen={isUpdateDialogOpen}
            closeDialog={closeUpdateDialog}
            dialogHeading={"Update student"}
          >
            <DialogContent>
              {/* Error message */}
              {updateError && (
                <Box mb={2}>
                  <Typography color="error" variant="h6">
                    {updateError}
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
                />
                <TextField
                  size="small"
                  type="Date of birth"
                  label="DOB"
                  name="studentDateOfBirth"
                  InputLabelProps={{ shrink: true }}
                  value={dayjs(selectedStudent?.studentDateOfBirth).format(
                    "YYYY-MM-DD"
                  )}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: new Date(e.target.value),
                    }))
                  }
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
                />
                <TextField
                  size="small"
                  label="Course"
                  required
                  select
                  error={!!updateError?.courseError} // Assuming updateError.courseError exists for validation
                  helperText={
                    updateError?.courseError ||
                    (courseChoices.length === 0 && !courseError
                      ? "No courses available"
                      : "")
                  }
                  variant="outlined"
                  name="courseCode"
                  disabled={courseChoices.length === 0 && !courseError}
                  value={selectedStudent?.studentCurrentCourseId || ""}
                  onChange={(e) => {
                    setSelectedStudent(
                      (prev) => (
                        console.log(prev),
                        {
                          ...prev,
                          studentCurrentCourseId: e.target.value,
                        }
                      )
                    );
                  }}
                >
                  {/* IMPORTANT: Only MenuItem children allowed */}
                  {courseChoices.length > 0 &&
                    courseChoices.map((c) => (
                      <MenuItem key={c?._id} value={c?._id}>
                        {c?.courseCode}
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
                />
                <TextField
                  label="City"
                  size="small"
                  name="city"
                  value={selectedStudent?.studentAddress?.city || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      fullAdd: {
                        ...prev.fullAdd,
                        [e.target.name]: e.target.value,
                      },
                    }))
                  }
                />
                <TextField
                  label="State"
                  size="small"
                  name="state"
                  value={selectedStudent?.studentAddress?.state || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      fullAdd: {
                        ...prev.fullAdd,
                        [e.target.name]: e.target.value,
                      },
                    }))
                  }
                />
                <TextField
                  size="small"
                  label="Country"
                  name="country"
                  value={selectedStudent?.studentAddress?.country || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      fullAdd: {
                        ...prev.fullAdd,
                        [e.target.name]: e.target.value,
                      },
                    }))
                  }
                />
                <TextField
                  label="Postal"
                  size="small"
                  name="postalCode"
                  value={selectedStudent?.studentAddress?.postalCode || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      fullAdd: {
                        ...prev.fullAdd,
                        [e.target.name]: e.target.value,
                      },
                    }))
                  }
                />
                <TextField
                  label="Category"
                  size="small"
                  name="studentCategory"
                  select
                  value={selectedStudent?.studentCategory || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                >
                  {categoryOptions.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Student type"
                  size="small"
                  name="studentType"
                  select
                  disabled={studentTypeOptions?.length == 0}
                  value={selectedStudent?.studentType || ""}
                  onChange={(e) => {
                    console.log(e);
                    console.log(e.target.name);
                    console.log(e.target.value);
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }));
                  }}
                >
                  {studentTypeOptions.length > 0 &&
                    studentTypeOptions?.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  label="Admission"
                  size="small"
                  name="studentAdmissionYear"
                  value={selectedStudent?.studentAdmissionYear || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: Number(e.target.value),
                    }))
                  }
                />
              </FormFieldsStack>
            </DialogContent>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "center",
                "& :hover": {
                  backgroundColor: colors.blue[100],
                },
              }}
            >
              <Box>
                <Button
                  sx={{
                    color: colors.text[100],
                    background: colors.green[100],
                  }}
                  onClick={() => handleUpdateStudent(selectedStudent)}
                  disabled={updateLoading}
                >
                  <Typography variant="h5">
                    {updateLoading ? "Updating..." : "Update"}
                  </Typography>
                </Button>
              </Box>
            </DialogActions>
          </FormDialogWrapper>
        )}
      </Box>

      {/* Delete Dialog */}
      <Box>
        {isDeleteDialogOpen && selectedStudent && (
          <FormDialogWrapper
            sx={{
              height: "46vh",
            }}
            isDialogOpen={isDeleteDialogOpen}
            closeDialog={closeDeleteDialog}
            dialogHeading={"Remove student"}
          >
            <DeleteConfirmationDialogContent
              onConfirm={() => {
                handleDeleteStudent(selectedStudent);
                closeDeleteDialog();
              }}
              onCancel={() => closeDeleteDialog}
              entityName={selectedStudent?.studentFullName}
            />
          </FormDialogWrapper>
        )}
      </Box>
      <Box>{isfetchError !== null && <Box>{isfetchError}</Box>}</Box>
    </Box>
  );
};

export default Students;
