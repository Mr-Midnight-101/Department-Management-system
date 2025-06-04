/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { getColorTokens } from "../../theme/theme";
import GridActionButton from "../../components/GridActionButton.jsx";
import GridHeaderWithAction from "../../components/GridHeaderWithAction.jsx";
import GridWrapper from "../../components/GridWrapper.jsx";
import PageSectionWrapper from "../../components/PageSectionWrapper.jsx";
import FormDialogWrapper from "../../components/FormDialogWrapper.jsx";
import FormFieldsStack from "../../components/FormFieldsStack.jsx";
import DeleteConfirmationDialogContent from "../../components/DeleteConfirmationDialogContent.jsx";
import {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "../../services/subject.js";

const Subjects = () => {
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);

  // Data and dialog state
  const [refreshTable, setRefreshTable] = useState(false);

  // Fetch subjects
  const [isDataFetched, setDataFetched] = useState(false);
  const [isFetchError, setFetchError] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const fetchSubjects = useCallback(async () => {
    try {
      const data = await getSubjects();
      const mappedRows = data.map((subject, i) => ({
        ...subject,
        id: subject._id || i,
        index: i + 1,
      }));
      setDataFetched(true);
      setSubjects(mappedRows);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setFetchError(true);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects, refreshTable]);

  // Register dialog state
  const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({});
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // Register Dialog open/close handlers
  const openRegisterDialog = () => {
    setRegisterForm({});
    setRegisterDialogOpen(true);
  };
  const closeRegisterDialog = () => {
    setRegisterDialogOpen(false);
    setRefreshTable((prev) => !prev);
  };

  // Update dialog state
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Update Dialog open/close handlers
  const openUpdateDialog = (subject) => {
    setSelectedSubject(subject);
    setUpdateDialogOpen(true);
  };
  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setRefreshTable((prev) => !prev);
  };

  // Delete dialog state
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const openDeleteDialog = (subject) => {
    setSelectedSubject(subject);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRefreshTable((prev) => !prev);
  };

  // CRUD handlers
  const handleRegisterSubject = async (formData) => {
    setRegisterError("");
    setRegisterLoading(true);
    // Add validation as needed
    try {
      const response = await addSubject(formData);
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

  const handleUpdateSubject = async (subject) => {
    setUpdateError("");
    setUpdateLoading(true);
    // Add validation as needed
    try {
      const updated = await updateSubject(subject.id, subject);
      if (!updated) {
        setUpdateError("Failed to update subject");
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

  const handleDeleteSubject = async (subject) => {
    try {
      const response = await deleteSubject(subject.id);
      if (!response) console.error("Failed to delete subject");
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting subject:", error);
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
        field: "subjectCode",
        headerName: "Subject Code",
        headerAlign: "center",
        align: "left",
        width: 120,
        maxWidth: 140,
      },
      {
        field: "subjectName",
        headerName: "Subject Name",
        headerAlign: "center",
        align: "left",
        width: 180,
        maxWidth: 220,
      },
      {
        field: "subjectMaxMarksTheory",
        headerName: "Theory Marks",
        headerAlign: "center",
        align: "left",
        width: 120,
        maxWidth: 140,
      },
      {
        field: "subjectMaxMarksPractical",
        headerName: "Practical Marks",
        headerAlign: "center",
        align: "left",
        width: 120,
        maxWidth: 140,
      },
      {
        field: "subjectCreditPoints",
        headerName: "Credit",
        headerAlign: "center",
        align: "left",
        width: 80,
        maxWidth: 100,
      },
      {
        field: "subjectTeachers",
        headerName: "Teachers",
        headerAlign: "center",
        align: "left",
        width: 200,
        maxWidth: 240,
        valueGetter: (params) =>
          Array.isArray(params?.row?.subjectTeachers)
            ? params.row.subjectTeachers.map((t) => t.teacherFullName).join(", ")
            : "",
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
    ],
    []
  );

  return (
    <Box width="100%">
      <PageSectionWrapper>
        <GridHeaderWithAction
          pageTitle={"Subject Records"}
          onButtonClick={openRegisterDialog}
          buttonLabel={"Add Subject"}
        />
        <GridWrapper
          isDatafetched={isDataFetched}
          rows={subjects}
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
              dialogHeading={"Register Subject"}
            >
              <DialogContent>
                {registerError && (
                  <Box mb={2}>
                    <Typography color="error" variant="body2">
                      {registerError}
                    </Typography>
                  </Box>
                )}
                <FormFieldsStack>
                  <TextField
                    size="medium"
                    label="Subject Code"
                    required
                    variant="outlined"
                    name="subjectCode"
                    value={registerForm.subjectCode || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <TextField
                    size="medium"
                    label="Subject Name"
                    required
                    variant="outlined"
                    name="subjectName"
                    value={registerForm.subjectName || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <TextField
                    size="medium"
                    label="Theory Marks"
                    required
                    variant="outlined"
                    name="subjectMaxMarksTheory"
                    type="number"
                    value={registerForm.subjectMaxMarksTheory || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: Number(e.target.value),
                      })
                    }
                  />
                  <TextField
                    size="medium"
                    label="Practical Marks"
                    required
                    variant="outlined"
                    name="subjectMaxMarksPractical"
                    type="number"
                    value={registerForm.subjectMaxMarksPractical || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: Number(e.target.value),
                      })
                    }
                  />
                  <TextField
                    size="medium"
                    label="Credit"
                    required
                    variant="outlined"
                    name="subjectCreditPoints"
                    type="number"
                    value={registerForm.subjectCreditPoints || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: Number(e.target.value),
                      })
                    }
                  />
                  {/* Add subjectTeachers selection as needed */}
                </FormFieldsStack>
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
                    onClick={() => handleRegisterSubject(registerForm)}
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
        {isUpdateDialogOpen && selectedSubject && (
          <FormDialogWrapper
            isDialogOpen={isUpdateDialogOpen}
            closeDialog={closeUpdateDialog}
            dialogHeading={"Update Subject"}
          >
            <DialogContent>
              {updateError && (
                <Box mb={2}>
                  <Typography color="error" variant="h6">
                    {updateError}
                  </Typography>
                </Box>
              )}
              <FormFieldsStack>
                <TextField
                  label="Subject Code"
                  name="subjectCode"
                  value={selectedSubject?.subjectCode || ""}
                  onChange={(e) =>
                    setSelectedSubject((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Subject Name"
                  name="subjectName"
                  value={selectedSubject?.subjectName || ""}
                  onChange={(e) =>
                    setSelectedSubject((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Theory Marks"
                  name="maxMarksTheory"
                  type="number"
                  value={selectedSubject?.maxMarksTheory || ""}
                  onChange={(e) =>
                    setSelectedSubject((prev) => ({
                      ...prev,
                      [e.target.name]: Number(e.target.value),
                    }))
                  }
                />
                <TextField
                  label="Practical Marks"
                  name="maxMarksPractical"
                  type="number"
                  value={selectedSubject?.maxMarksPractical || ""}
                  onChange={(e) =>
                    setSelectedSubject((prev) => ({
                      ...prev,
                      [e.target.name]: Number(e.target.value),
                    }))
                  }
                />
                <TextField
                  label="Credit"
                  name="subCredit"
                  type="number"
                  value={selectedSubject?.subCredit || ""}
                  onChange={(e) =>
                    setSelectedSubject((prev) => ({
                      ...prev,
                      [e.target.name]: Number(e.target.value),
                    }))
                  }
                />
                {/* Add subjectTeachers selection if needed */}
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
                  onClick={() => handleUpdateSubject(selectedSubject)}
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
        {isDeleteDialogOpen && selectedSubject && (
          <FormDialogWrapper
            sx={{ height: "20vh" }}
            isDialogOpen={isDeleteDialogOpen}
            closeDialog={closeDeleteDialog}
            dialogHeading={"Remove Subject"}
          >
            <DeleteConfirmationDialogContent
              onConfirm={() => handleDeleteSubject(selectedSubject)}
              onCancel={closeDeleteDialog}
              entityName={selectedSubject?.subjectName}
            />
          </FormDialogWrapper>
        )}
      </Box>
    </Box>
  );
};

export default Subjects;