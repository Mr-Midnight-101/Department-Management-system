/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from "react";

//date setup
import dayjs from "dayjs";

//MUI import
import { getColorTokens } from "../../theme/theme";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";

//icons
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditNoteIcon from "@mui/icons-material/EditNote";
import WidthFullIcon from "@mui/icons-material/WidthFull";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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
import { categoryOptions, studentTypeOptions } from "./dropDownItems.js";

const StudentsPage = () => {
  //autosize of column
  const autosizeOptions = {
    includeOutliers: true,
  };
  const apiRef = useGridApiRef();

  //theme setup
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);

  // Data and dialog state
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refreshTable, setRefreshTable] = useState(false);

  // Register dialog state
  const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({});

  // Update dialog state
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);

  // Delete dialog state
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Error and loading state for registration
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  //  Error and loading state for updation
  const [updateError, setUpdateError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch students
  const fetchStudents = useCallback(async () => {
    try {
      const data = await getStudents();
      const mappedRows = data.map((student, i) => ({
        ...student,
        id: student._id || i,
        index: i + 1,
        city: student.fullAdd?.city || "",
        state: student.fullAdd?.state || "",
      }));
      setStudents(mappedRows);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, refreshTable]);

  // Dialog open/close handlers
  const openRegisterDialog = () => setRegisterDialogOpen(true);
  const closeRegisterDialog = () => {
    setRegisterDialogOpen(false);
    setRefreshTable((prev) => !prev);
  };

  const openUpdateDialog = (student) => {
    setSelectedStudent(student);
    setUpdateDialogOpen(true);
  };
  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setRefreshTable((prev) => !prev);
  };

  const openDeleteDialog = (student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRefreshTable((prev) => !prev);
  };

  // CRUD handlers
  const handleRegisterStudent = async (formData) => {
    setRegisterError("");
    setRegisterLoading(true);
    const validationMsg = validateStudentForm(formData);
    if (validationMsg) {
      setRegisterError(validationMsg);
      setRegisterLoading(false);
      return;
    }
    try {
      const response = await studentRegister(formData);
      if (!response || response.status !== 201) {
        setRegisterError(
          response?.message || "Registration failed. Please try again."
        );
        setRegisterLoading(false);
        return;
      }
      closeRegisterDialog();
    } catch (error) {
      setRegisterError(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdateStudent = async (student) => {
    setUpdateError("");
    setUpdateLoading(true);
    const validationMsg = validateStudentForm(student);
    if (validationMsg) {
      setUpdateError(validationMsg);
      setUpdateLoading(false);
      return;
    }
    try {
      const updated = await updateStudentDetails(student);
      if (!updated) {
        setUpdateError("Failed to update student");
        setUpdateLoading(false);
        return;
      }
      closeUpdateDialog();
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
  const columns = useMemo(
    () => [
      {
        field: "index",
        headerName: "S. No.",
        headerAlign: "center",
        align: "left",
        width: 60,
        maxWidth: 100,
      },
      {
        field: "fullName",
        headerName: "Full Name",
        headerAlign: "center",
        align: "left",
        width: 100,
        maxWidth: 140,
      },
      {
        field: "dateOfBirth",
        headerName: "DOB",
        headerAlign: "center",
        align: "left",
        Width: 120,
        maxWidth: 120,
      },
      {
        field: "enrollmentNo",
        headerName: "Enrollment No.",
        headerAlign: "center",
        align: "left",
        width: 160,
        maxWidth: 180,
      },
      {
        field: "rollNo",
        headerName: "Roll No.",
        headerAlign: "center",
        align: "left",
        maxWidth: 180,
        Width: 160,
      },
      {
        field: "email",
        headerName: "Email ID",
        headerAlign: "center",
        align: "left",
        maxWidth: 160,
        Width: 160,
      },
      {
        field: "contactInfo",
        headerName: "Contact No.",
        headerAlign: "center",
        align: "left",
        maxWidth: 160,
        Width: 160,
      },
      {
        field: "fatherName",
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
      {
        field: "category",
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
        field: "admissionYear",
        headerName: "Admission",
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
            <Box
              display="flex"
              justifyContent="space-evenly"
              alignItems="center"
              sx={{ m: 1 }}
            >
              <IconButton
                onClick={() => openUpdateDialog(selectedRow)}
                sx={{
                  borderRadius: 1,
                  backgroundColor: colors.blue[100],
                  color: colors.text[100],
                }}
                aria-label="edit"
              >
                <EditNoteIcon />
              </IconButton>
              <IconButton
                onClick={() => openDeleteDialog(selectedRow)}
                sx={{
                  borderRadius: 1,
                  backgroundColor: colors.red[100],
                  color: colors.text[100],
                }}
                aria-label="delete"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          );
        },
      },
    ],
    [colors]
  );

  return (
    <Box width="100%">
      {/* Header and Add Student Button */}
      <Box
        sx={{
          flex: 1,
          m: { xs: 2, md: 2 },
          mr: { xs: 12, md: 12, lg: 12, xl: 2 },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            gap: 1,
            my: 2,
            mr: 0,
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.6rem", sm: "2rem" },
              color: colors.grey[800],
            }}
          >
            {"Student Table"}
          </Typography>

          <IconButton
            onClick={openRegisterDialog}
            sx={{
              gap: 1,
              display: "flex",
              alignItems: "center",
              borderRadius: 1,
              background: colors.primary[900],
              backgroundPosition: "center",
              color: colors.text[100],
              "&:hover": {
                background: colors.gradient[100],
              },
            }}
          >
            <PersonAddIcon />
            <Typography
              variant="h5"
              sx={{
                lineHeight: 1,
                fontWeight: { xs: 200, sm: 400 },
                color: colors.text[100],
              }}
            >
              {"Add Student"}
            </Typography>
          </IconButton>
        </Box>

        {/* DataGrid */}
        <Box
          maxHeight="60vh"
          maxWidth="100%"
          m="24px 0"
          sx={{
            "& .MuiDataGrid-filler": {
              background: `${colors.primary[900]} !important`,
            },
            "& .MuiDataGrid-root": {
              border: "none",
              background: `${colors.primary[900]} !important`,
              color: `${colors.text[100]} !important`,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: `${colors.clay[100]} !important`,
            },
            "& .MuiDataGrid-row": {
              background: `${colors.primary[900]} !important`,
              "&.Mui-selected": {
                backgroundColor: `${colors.pink[100]} !important`,
                "&:hover": {
                  backgroundColor: `${colors.ArtyClick[100]} !important`,
                },
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: "0.9rem",
            },
            "& .MuiDataGrid-columnHeader": {
              borderBottom: "none",
              background: `${colors.primary[900]} !important`,
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: `${colors.grey[100]} !important`,
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: `${colors.primary[900]} !important`,
            },
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
            mr: { xl: 0 },
          }}
        >
          <DataGrid
            sx={{
              maxHeight: "60vh",
              maxWidth: "100vw",
              width: "100%",
            }}
            rowBufferPx={10}
            slotProps={{
              loadingOverlay: {
                variant: "skeleton",
                noRowsVariant: "skeleton",
              },
            }}
            apiRef={apiRef}
            autosizeOptions={autosizeOptions}
            disableColumnResize
            disableColumnSelector
            columns={columns}
            rows={students}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" m="4px  0">
          <IconButton
            onClick={() => apiRef.current?.autosizeColumns(autosizeOptions)}
            sx={{
              gap: 1,
              display: "flex",
              alignItems: "center",
              borderRadius: 1,
              background: colors.primary[900],
              backgroundPosition: "center",
              color: colors.text[100],
              "&:hover": {
                background: colors.gradient[100],
              },
            }}
          >
            <WidthFullIcon />
            <Typography
              variant="h5"
              sx={{
                lineHeight: 1,
                fontWeight: { xs: 200, sm: 400 },
                color: colors.text[100],
              }}
            >
              Re-size Column
            </Typography>
          </IconButton>
        </Box>
      </Box>

      {/* Register Dialog */}
      <Box>
        {isRegisterDialogOpen && (
          <Box
            sx={{
              "& .MuiTextField-input:focus": {},
            }}
          >
            <Dialog
              open={isRegisterDialogOpen}
              onClose={closeRegisterDialog}
              scroll="paper"
              maxWidth="lg"
              slotProps={{
                paper: {
                  sx: {
                    width: { xs: "80vw", sm: "40vw", md: "40vw" },
                    height: { xs: "80vh", sm: "70vh", md: "60vh" },
                    p: 2,
                  },
                },
              }}
            >
              {/* heading and close button */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <Box
                  display="flex"
                  width="100%"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <IconButton sx={{}} onClick={closeRegisterDialog}>
                    <CancelIcon sx={{ fontSize: "34px" }} />
                  </IconButton>
                </Box>
                <Box>
                  <Typography variant="h3">Register Student</Typography>
                </Box>
              </Box>
              <DialogContent>
                {/* Error message */}
                {registerError && (
                  <Box mb={2}>
                    <Typography color="error" variant="body2">
                      {registerError}
                    </Typography>
                  </Box>
                )}
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="12px"
                  sx={{
                    flex: 1,
                    mt: 1,
                  }}
                >
                  <TextField
                    size="medium"
                    label="Full Name"
                    required
                    variant="outlined"
                    name="fullName"
                    value={registerForm.fullName || ""}
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
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true, // still valid and needed
                    }}
                    name="dateOfBirth"
                    value={registerForm.dateOfBirth || ""}
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
                    variant="outlined"
                    name="enrollmentNo"
                    value={registerForm.enrollmentNo || ""}
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
                    variant="outlined"
                    name="rollNo"
                    value={registerForm.rollNo || ""}
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
                    variant="outlined"
                    name="email"
                    value={registerForm.email || ""}
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
                    variant="outlined"
                    name="contactInfo"
                    value={registerForm.contactInfo || ""}
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
                    required
                    variant="outlined"
                    name="fatherName"
                    value={registerForm.fatherName || ""}
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
                    name="city"
                    value={registerForm?.fullAdd?.city || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        fullAdd: {
                          ...registerForm.fullAdd,
                          [e.target.name]: e.target.value,
                        },
                      })
                    }
                  />
                  <TextField
                    size="medium"
                    label="State"
                    required
                    variant="outlined"
                    name="state"
                    value={registerForm?.fullAdd?.state || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        fullAdd: {
                          ...registerForm.fullAdd,
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
                    name="country"
                    value={registerForm?.fullAdd?.country || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        fullAdd: {
                          ...registerForm.fullAdd,
                          [e.target.name]: e.target.value || "India",
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
                    name="category"
                    value={registerForm.category || ""}
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
                    label="Admission Year"
                    required
                    variant="outlined"
                    name="admissionYear"
                    value={registerForm.admissionYear || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: Number(e.target.value),
                      })
                    }
                  />
                  <TextField
                    require="true"
                    size="medium"
                    label="Postal Code"
                    variant="outlined"
                    name="postalCode"
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        fullAdd: {
                          ...registerForm.fullAdd,
                          postalCode: e.target.value,
                        },
                      })
                    }
                  />
                </Box>
              </DialogContent>
              <Box display="flex" justifyContent="center">
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
            </Dialog>
          </Box>
        )}
      </Box>

      {/* Update Dialog */}
      <Box>
        {isUpdateDialogOpen && selectedStudent && (
          <Dialog
            open={isUpdateDialogOpen}
            onClose={closeUpdateDialog}
            scroll="paper"
            maxWidth="lg"
            slotProps={{
              paper: {
                sx: {
                  width: { xs: "80vw", sm: "40vw", md: "40vw" },
                  height: { xs: "80vh", sm: "70vh", md: "60vh" },
                  p: 2,
                },
              },
            }}
          >
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <Box
                  display="flex"
                  width="100%"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <IconButton sx={{}} onClick={closeUpdateDialog}>
                    <CancelIcon sx={{ fontSize: "34px" }} />
                  </IconButton>
                </Box>
                <Box>
                  <Typography variant="h3">Update Student Details</Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              {/* Error message */}
              {updateError && (
                <Box mb={2}>
                  <Typography color="error" variant="body2">
                    {updateError}
                  </Typography>
                </Box>
              )}
              <Box
                display="flex"
                flexDirection="column"
                gap="12px"
                sx={{
                  flex: 1,
                  mt: 1,
                }}
              >
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={selectedStudent?.fullName || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  type="date"
                  label="DOB"
                  name="dateOfBirth"
                  InputLabelProps={{ shrink: true }}
                  value={dayjs(selectedStudent?.dateOfBirth).format(
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
                  label="enrollmentNo"
                  name="enrollmentNo"
                  value={selectedStudent?.enrollmentNo || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="rollNo"
                  name="rollNo"
                  value={selectedStudent?.rollNo || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="email"
                  name="email"
                  value={selectedStudent?.email || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="contactInfo"
                  name="contactInfo"
                  value={selectedStudent?.contactInfo || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="fatherName"
                  name="fatherName"
                  value={selectedStudent?.fatherName || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="city"
                  name="city"
                  value={selectedStudent?.fullAdd?.city || ""}
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
                  label="state"
                  name="state"
                  value={selectedStudent?.fullAdd?.state || ""}
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
                  label="country"
                  name="country"
                  value={selectedStudent?.fullAdd?.country || ""}
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
                  label="postalCode"
                  name="postalCode"
                  value={selectedStudent?.fullAdd?.postalCode || ""}
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
                  label="category"
                  name="category"
                  select
                  value={selectedStudent?.category || ""}
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
                  label="studentType"
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
                  label="admissionYear"
                  name="admissionYear"
                  value={selectedStudent?.admissionYear || ""}
                  onChange={(e) =>
                    setSelectedStudent((prev) => ({
                      ...prev,
                      [e.target.name]: Number(e.target.value),
                    }))
                  }
                />
              </Box>
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
          </Dialog>
        )}
      </Box>

      {/* Delete Dialog */}
      <Box>
        {isDeleteDialogOpen && selectedStudent && (
          <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
                Are you sure you want to delete data of{" "}
                {selectedStudent?.fullName}?
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This action cannot be undone.
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  onClick={closeDeleteDialog}
                  color="primary"
                  variant="filled"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteStudent(selectedStudent);
                    closeDeleteDialog();
                  }}
                  color="error"
                  variant="contained"
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};

export default StudentsPage;
