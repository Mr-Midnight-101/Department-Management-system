/* eslint-disable no-unused-vars */
import React, { use, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import { getColorTokens } from "../../theme/theme.js";
import RegisterStudent from "./RegisterStudent.jsx";
import { getStudents, updateStudentDetails } from "../../services/student.js";
import GridDisplayPanel from "../../components/GridDisplayPanel.jsx";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { columnResizeStateInitializer } from "@mui/x-data-grid/internals";

const Students = () => {
  const categories = [
    {
      label: "GEN",
      value: "GEN",
    },
    {
      label: "OBC",
      value: "OBC",
    },
    {
      label: "SC",
      value: "SC",
    },
    {
      label: "ST",
      value: "ST",
    },
    {
      label: "OTHER",
      value: "OTHER",
    },
  ];
  const studentTypes = [
    {
      label: "Regular",
      value: "Regular",
    },
    {
      label: "Private",
      value: "Private",
    },
    {
      label: "International",
      value: "International",
    },
  ];
  // Get color tokens based on theme mode (light/dark)
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);
  //!---------------- Grid row state---------------
  const [rows, setrows] = useState([]); // State to store rows of student data for the DataGrid
  const [student, setStudent] = useState({}); //targeting every row

  //!-------------- registration form-----------------
  const [registerOpen, setregisterOpen] = useState(false); // State to control the visibility of the RegisterStudent modal/dialog
  // Memoized callback to close the RegisterStudent dialog
  const closeRegister = React.useCallback(() => setregisterOpen(false), []);

  //! -----------update form-----------------

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const openUpdateDialog = () => setIsUpdateDialogOpen(true);
  const closeUpdateDialog = () => setIsUpdateDialogOpen(false);

  const handleUpdateStudent = async (student) => {
    console.log("handle update log", student);

    try {
      const updateStudent = await updateStudentDetails(student);
      if (!updateStudent) {
        console.log("failed update");
      }
      closeUpdateDialog();

      console.log(
        "handle update log inside try block updateStudent and return data from backend after call of function",
        updateStudent
      );
    } catch (error) {
      console.log("handle upadate error of catch block", error);
    }
  };

  //! ---- delete student -------------
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleDeleteStudent = (student) => {};
  /**
   * Fetch students data from backend/service.
   * Maps the received data to format suitable for DataGrid.
   * Sets the formatted rows to state.
   */
  const fetchStudents = async () => {
    try {
      const output = await getStudents();
      const mappedRows = output.map((row, i) => ({
        ...row,
        id: row._id || i, // Use _id as unique identifier if present, else fallback to index
        index: i + 1, // Serial number for display
        city: row.fullAdd?.city || "", // Extract city from nested address
        state: row.fullAdd?.state || "", // Extract state from nested address
      }));
      setrows(mappedRows);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch students when component mounts and when RegisterStudent dialog closes
  useEffect(() => {
    fetchStudents();
   
  }, [ handleUpdateStudent, RegisterStudent]);

  /**
   * Columns definition for DataGrid.
   * Uses useMemo for performance optimization so columns don't recreate on each render.
   */
  const columns = useMemo(
    () => [
      {
        field: "index",
        headerName: "S. No.",
        headerAlign: "center",
        align: "center",
        width: 60,
      },
      {
        field: "fullName",
        headerName: "Full Name",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "dateOfBirth",
        headerName: "DOB",
        headerAlign: "center",
        align: "center",
      },
      {
        field: "enrollmentNo",
        headerName: "Enrollment No.",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "rollNo",
        headerName: "Roll No.",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "email",
        headerName: "Email ID",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "contactInfo",
        headerName: "Contact No.",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "fatherName",
        headerName: "Father's Name",
        headerAlign: "center",
        align: "left",
      },
      {
        field: "city",
        headerName: "City",
        headerAlign: "center",
        align: "center",
      },
      {
        field: "state",
        headerName: "State",
        headerAlign: "center",
        align: "center",
      },
      {
        field: "category",
        headerName: "Category",
        headerAlign: "center",
        align: "center",
      },
      {
        field: "studentType",
        headerName: "Type",
        headerAlign: "center",
        align: "center",
      },
      {
        field: "admissionYear",
        headerName: "Admission",
        headerAlign: "center",
        align: "center",
      },
      {
        field: "action",
        headerName: "Actions",
        headerAlign: "center",
        align: "center",
        width: 140,
        renderCell: (params) => (
          <Box
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
            sx={{
              m: 1,
            }}
          >
            <IconButton
              onClick={() => {
                setStudent(params.row);
                console.log(params.row);
                openUpdateDialog(true);
              }}
              sx={{ borderRadius: 1, background: colors.grey[700] }}
            >
              <EditNoteIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setStudent(params.row);
                openDeleteDialog(true);
                console.log(params.row);
              }}
              sx={{ borderRadius: 1, backgroundColor: colors.red[700] }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [colors]
  );

  return (
    <Box>
      <Box>
        <GridDisplayPanel
          tableColumns={columns}
          tableRows={rows}
          themeColors={colors}
          openRegisterDialog={setregisterOpen}
          tableHeading="Student Records"
          addButtonLabel="Register Student"
        />
      </Box>

      <Box>
        {/* Conditionally render the RegisterStudent dialog */}
        {registerOpen && (
          <RegisterStudent
            openRegister={setregisterOpen}
            closeRegister={closeRegister}
          />
        )}
      </Box>
      <Box
        sx={{
          background: "transparent",
        }}
      >
        {isDeleteDialogOpen && (
          <Dialog
            open={setIsDeleteDialogOpen} // Pass the boolean state
            onClose={closeDeleteDialog}
          >
            <Box>
              <IconButton onClick={() => setIsDeleteDialogOpen(false)}>
                Close
              </IconButton>
            </Box>
            <Box>{student._id}</Box>
            <Box></Box>
          </Dialog>
        )}
      </Box>
      <Box
        sx={{
          background: "transparent",
        }}
      >
        {isUpdateDialogOpen && (
          <Dialog
            open={setIsDeleteDialogOpen} // Pass the boolean state
            onClose={closeUpdateDialog}
          >
            <Box>
              <IconButton onClick={() => setIsUpdateDialogOpen(false)}>
                Close
              </IconButton>
            </Box>
            <Box>{student._id}</Box>
            <Box display="flex" flexDirection="column" justifyContent="center">
              <TextField
                label="Full Name"
                name="fullName"
                value={student?.fullName || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <TextField
                type="date"
                label="DOB"
                name="dateOfBirth"
                value={student?.dateOfBirth || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <TextField
                label="enrollmentNo"
                name="enrollmentNo"
                value={student?.enrollmentNo || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <TextField
                label="rollNo"
                name="rollNo"
                value={student?.rollNo || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <TextField
                label="email"
                name="email"
                value={student?.email || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <TextField
                label="contactInfo"
                name="contactInfo"
                value={student?.contactInfo || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <TextField
                label="fatherName"
                name="fatherName"
                value={student?.fatherName || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <TextField
                label="city"
                name="city"
                value={student?.fullAdd?.city || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
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
                value={student?.fullAdd?.state || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
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
                value={student?.country || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
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
                value={student?.postalCode || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
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
                value={student?.category || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              >
                {" "}
                {categories.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="studentType"
                name="studentType"
                select
                value={student?.studentType || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              >
                {studentTypes.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="admissionYear"
                name="admissionYear"
                value={student?.admissionYear || ""}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <Button onClick={() => handleUpdateStudent(student)}>
                update
              </Button>
            </Box>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};

export default Students;
