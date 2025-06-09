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
import { subjectValidation } from "./subjectValidation.js";

const Subjects = () => {
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);

  // Data and dialog state
  const [refreshTable, setRefreshTable] = useState(false);
  const [validationError, setValidationError] = useState("");

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
    setValidationError("");
    setRegisterError({});
    setRefreshTable((prev) => !prev);
    setRegisterDialogOpen(false);
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
    setValidationError("");
    setUpdateError({});
    setRefreshTable((prev) => !prev);
    setUpdateDialogOpen(false);
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
    setRegisterError({});
    setValidationError("");
    setRegisterLoading(true);
    const registrationMsg = subjectValidation(formData);
    if (Object.keys(registrationMsg).length > 0) {
      setRegisterError(registrationMsg);
      setRegisterLoading(false);
      return;
    }
    try {
      const response = await addSubject(formData);
      console.log(response);
      if (response.statusCode == 201) {
        closeRegisterDialog();
      }
      setRegisterLoading(false);
      return;
    } catch (error) {
      setValidationError(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdateSubject = async (subject) => {
    setUpdateError({});
    setUpdateLoading(true);
    console.log("handle update", subject);
    const registrationMsg = subjectValidation(subject);
    if (Object.keys(registrationMsg).length > 0) {
      setUpdateError(registrationMsg);
      setUpdateLoading(false);
      return;
    }
    try {
      const updated = await updateSubject(subject.id, subject);
      console.log("update after call back api: ", updated);

      if (updated.statusCode == 200) {
        closeUpdateDialog();
      }
      setUpdateLoading(false);
      return;
    } catch (error) {
      setValidationError(
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
            ? params.row.subjectTeachers
                .map((t) => t.teacherFullName)
                .join(", ")
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
                <FormFieldsStack>
                  <TextField
                    size="small"
                    label="Subject Code"
                    required
                    error={!!registerError?.codeError}
                    helperText={registerError?.codeError}
                    variant="outlined"
                    name="subjectCode"
                    value={registerForm?.subjectCode || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <TextField
                    size="small"
                    label="Subject Name"
                    error={!!registerError?.nameError}
                    helperText={registerError?.nameError}
                    required
                    variant="outlined"
                    name="subjectName"
                    value={registerForm?.subjectName || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <TextField
                    size="small"
                    label="Theory Marks"
                    required
                    variant="outlined"
                    error={!!registerError?.theoryError}
                    helperText={registerError?.theoryError}
                    name="subjectMaxMarksTheory"
                    type="number"
                    value={registerForm?.subjectMaxMarksTheory || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: Number(e.target.value),
                      })
                    }
                  />
                  <TextField
                    size="small"
                    label="Practical Marks"
                    required
                    error={!!registerError?.practicalError}
                    helperText={registerError?.practicalError}
                    variant="outlined"
                    name="subjectMaxMarksPractical"
                    type="number"
                    value={registerForm?.subjectMaxMarksPractical || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: Number(e.target.value),
                      })
                    }
                  />
                  <TextField
                    size="small"
                    label="Credit"
                    required
                    error={!!registerError?.creditError}
                    helperText={registerError?.creditError}
                    variant="outlined"
                    name="subjectCreditPoints"
                    type="number"
                    value={registerForm?.subjectCreditPoints || ""}
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
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                {validationError && (
                  <Box>
                    <Typography color="error" variant="h6">
                      {validationError}
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
              <FormFieldsStack>
                <TextField
                  size="small"
                  label="Subject Code"
                  name="subjectCode"
                  error={!!updateError?.codeError}
                  helperText={updateError?.codeError}
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
                  size="small"
                  name="subjectName"
                  error={!!updateError?.nameError}
                  helperText={updateError?.nameError}
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
                  name="subjectMaxMarksTheory"
                  size="small"
                  type="number"
                  error={!!updateError?.theoryError}
                  helperText={updateError?.theoryError}
                  value={selectedSubject?.subjectMaxMarksTheory || ""}
                  onChange={(e) =>
                    setSelectedSubject((prev) => ({
                      ...prev,
                      [e.target.name]: Number(e.target.value),
                    }))
                  }
                />
                <TextField
                  label="Practical Marks"
                  size="small"
                  name="subjectMaxMarksPractical"
                  type="number"
                  error={!!updateError?.practicalError}
                  helperText={updateError?.practicalError}
                  value={selectedSubject?.subjectMaxMarksPractical || ""}
                  onChange={(e) =>
                    setSelectedSubject((prev) => ({
                      ...prev,
                      [e.target.name]: Number(e.target.value),
                    }))
                  }
                />
                <TextField
                  label="Credit"
                  name="subjectCreditPoints"
                  type="number"
                  size="small"
                  error={!!updateError?.creditError}
                  helperText={updateError?.creditError}
                  value={selectedSubject?.subjectCreditPoints || ""}
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
            {validationError && (
              <Box>
                <Typography color="error" variant="h6">
                  {validationError}
                </Typography>
              </Box>
            )}
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
            sx={{ height: "34vh" }}
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
