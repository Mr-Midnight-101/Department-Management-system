/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from "react";

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
const Students = () => {
  //theme setup
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);

  // Data and dialog state
  const [refreshTable, setRefreshTable] = useState(false);

  //!____________________________________________________Fetch students
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
    fetchStudents();
  }, [fetchStudents, refreshTable]);

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

  //!______________________________________________________update student
  // Update dialog state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);

  //  Error and loading state for updation
  const [updateError, setUpdateError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // update Dialog open/close handlers
  const openUpdateDialog = (student) => {
    setSelectedStudent(student);
    setUpdateDialogOpen(true);
  };
  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
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
    console.log("handle register form: ", formData);
    setRegisterError({});
    setRegisterLoading(true);
    const validationMsg = validateStudentForm(formData);
    console.log("after validation return output: ", validationMsg);
    if (validationMsg && Object.keys(validationMsg).length > 0) {
      setRegisterError(validationMsg);
      setRegisterLoading(false);
      closeUpdateDialog();
      return;
    }
    try {
      console.log("passing data in api after validation", formData);
      const response = await studentRegister(formData);
      if (response.status === 201) {
        setRegisterError({});
        closeRegisterDialog();
      }
    } catch (error) {
      setControllerError(error?.response?.data?.message);
      console.log(error);
      console.log(error?.response);
      console.log(error?.response?.data);
      console.log(error?.response?.data?.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  // Update Handler
  const handleUpdateStudent = async (student) => {
    setUpdateError("");
    setUpdateLoading(true);
    console.log("Handler called");
    console.log(typeof student?.studentAdmissionYear);
    console.log("Handler finished");
    const validationMsg = validateStudentForm(student);
    if (validationMsg && Object.keys(validationMsg).length > 0) {
      setUpdateError(validationMsg);
      setUpdateLoading(false);
      closeUpdateDialog();
      return;
    }
    try {
      const updated = await updateStudentDetails(student);
      if (!updated) {
        setUpdateError("Failed to update student");
        setUpdateLoading(false);
        return;
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
  const handleDeleteStudent = async (student) => {
    try {
      const response = await deleteStudent(student);
      if (!response) console.error("Failed to delete student");
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // DataGrid columns
  const columns = [
    {
      field: "index",
      headerName: "S. No.",
      headerAlign: "center",
      align: "left",
      width: 60,
      maxWidth: 100,
    },
    {
      field: "studentFullName",
      headerName: "Full Name",
      headerAlign: "center",
      align: "left",
      width: 100,
      maxWidth: 140,
    },
    {
      field: "studentDateOfBirth",
      headerName: "DOB",
      headerAlign: "center",
      align: "left",
      Width: 120,
      maxWidth: 120,
    },
    {
      field: "studentEnrollmentNumber",
      headerName: "Enrollment No.",
      headerAlign: "center",
      align: "left",
      width: 160,
      maxWidth: 180,
    },
    {
      field: "studentRollNumber",
      headerName: "Roll No.",
      headerAlign: "center",
      align: "left",
      maxWidth: 180,
      Width: 160,
    },
    {
      field: "studentEmail",
      headerName: "Email",
      headerAlign: "center",
      align: "left",
      maxWidth: 160,
      Width: 160,
    },
    {
      field: "studentContactNumber",
      headerName: "Contact No.",
      headerAlign: "center",
      align: "left",
      maxWidth: 160,
      Width: 160,
    },
    {
      field: "studentFatherName",
      headerName: "Father's Name",
      headerAlign: "center",
      align: "left",
      maxWidth: 180,
    },
    {
      field: "city",
      headerName: "City",
      headerAlign: "center",
      align: "left",
      maxWidth: 120,
    },
    {
      field: "state",
      headerName: "State",
      headerAlign: "center",
      align: "left",
      maxWidth: 120,
    },
    // {
    //   field: "country",
    //   headerName: "Country",
    //   headerAlign: "center",
    //   align: "left",
    //   maxWidth: 120,
    // },
    // {
    //   field: "postalCode",
    //   headerName: "Postal Code",
    //   headerAlign: "center",
    //   align: "left",
    //   maxWidth: 120,
    // },
    {
      field: "studentCategory",
      headerName: "Category",
      headerAlign: "center",
      align: "left",
      maxWidth: 140,
    },
    {
      field: "studentType",
      headerName: "Type",
      headerAlign: "center",
      align: "left",
      maxWidth: 140,
    },
    {
      field: "studentAdmissionYear",
      headerName: "Admission Year",
      headerAlign: "center",
      align: "center",
      maxWidth: 80,
      width: 60,
      marginLeft: 2,
    },
    {
      field: "action",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      minWidth: 140,
      maxWidth: 180,
      renderCell: (params) => {
        const selectedRow = params.row;
        return (
          <GridActionButton
            openUpdateDialog={() => openUpdateDialog(selectedRow)}
            openDeleteDialog={() => openDeleteDialog(selectedRow)}
            selectedRow={selectedRow}
          />
        );
      },
    },
  ];

  return (
    <Box width="100%">
      <PageSectionWrapper>
        {/* Header and Add Student Button */}
        <GridHeaderWithAction
          pageTitle={"Student Enrollment Records"}
          onButtonClick={openRegisterDialog}
          buttonLabel={"Add Student"}
        />

        {/* DataGrid */}
        <GridWrapper
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
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
                    size="medium"
                    label="Student Type"
                    required
                    error={!!registerError?.studentTypeError}
                    helperText={registerError?.studentTypeError}
                    select
                    variant="outlined"
                    name="studentType"
                    value={registerForm.studentType || ""}
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
                    size="medium"
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
                  label="Roll no."
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
                  name="studentType"
                  select
                  value={selectedStudent?.studentType || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                >
                  {studentTypeOptions.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Admission"
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
              height: "36vh",
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
