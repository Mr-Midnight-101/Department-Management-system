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
import {
  fetchCourses,
  createCourse,
  updateCourse,
  removeCourse,
} from "../../services/course.js";

import GridHeaderWithAction from "../../components/GridHeaderWithAction.jsx";
import GridWrapper from "../../components/GridWrapper.jsx";
import PageSectionWrapper from "../../components/PageSectionWrapper.jsx";
import FormDialogWrapper from "../../components/FormDialogWrapper.jsx";
import FormFieldsStack from "../../components/FormFieldsStack.jsx";
import DeleteConfirmationDialogContent from "../../components/DeleteConfirmationDialogContent.jsx";
import GridActionButton from "../../components/GridActionButton.jsx";
import { durationoptions, semesterOptions } from "./menuList.js";
import courseValidator from "./courseValidator.js";
// Example dropdown options (customize as needed)

const Course = () => {
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);

  // Data and dialog state
  const [courses, setCourses] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);

  // Fetch courses
  const [isDataFetched, setDataFetched] = useState(false);
  const [isFetchError, setFetchError] = useState(false);
  const fetchAllCourses = useCallback(async () => {
    try {
      const data = await fetchCourses();
      const mappedRows = data.map((course, i) => ({
        ...course,
        id: course._id || i,
        index: i + 1,
      }));
      setCourses(mappedRows);
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setFetchError(true);
    }
  }, []);

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses, refreshTable]);

  // Register dialog state
  const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({});
  const [registerError, setRegisterError] = useState(undefined);
  const [validationError, setValidationError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // Register Dialog open/close handlers
  const openRegisterDialog = () => {
    setRegisterForm({});
    setRegisterDialogOpen(true);
  };
  const closeRegisterDialog = () => {
    setRegisterError({});
    setValidationError("");
    setRegisterDialogOpen(false);
    setRefreshTable((prev) => !prev);
  };

  // Update dialog state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Update Dialog open/close handlers
  const openUpdateDialog = (course) => {
    setSelectedCourse(course);
    setUpdateDialogOpen(true);
    setUpdateLoading(false);
  };
  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setRefreshTable((prev) => !prev);
    setUpdateError(undefined);
  };

  // Delete dialog state
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const openDeleteDialog = (course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRefreshTable((prev) => !prev);
  };

  // CRUD handlers
  const handleRegisterCourse = async (formData) => {
    setRegisterError({});
    setRegisterLoading(true);
    const validationMsg = courseValidator(formData);
    if (Object.keys(validationMsg).length > 0) {
      setRegisterLoading(false);
      setRegisterError(validationMsg);
      console.log("validation msg returned value", validationMsg);
      return;
    }

    try {
      const response = await createCourse(formData);
      console.log(response);
      if (!response || response.status !== 201) {
        setRegisterLoading(false);
        return;
      }
      closeRegisterDialog();
    } catch (error) {
      console.log(error);
      setValidationError(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdateCourse = async (course) => {
    setUpdateError({});
    setUpdateLoading(true);
    const validationMsg = courseValidator(course);
    if (Object.keys(validationMsg).length > 0) {
      setUpdateLoading(false);
      setUpdateError(validationMsg);
      console.log("validation msg returned value", validationMsg);
      return;
    }
    try {
      const updated = await updateCourse(course);

      if (updated.statusCode == 200) {
        console.log(updated);
        closeUpdateDialog();
        return;
      }
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

  const handleDeleteCourse = async (course) => {
    try {
      const response = await removeCourse(course);
      if (!response) console.error("Failed to delete course");
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting course:", error);
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
        field: "courseCode",
        headerName: "Course Code",
        headerAlign: "center",
        align: "left",
        width: 120,
        maxWidth: 140,
      },
      {
        field: "courseTitle",
        headerName: "Course Title",
        headerAlign: "center",
        align: "left",
        width: 180,
        maxWidth: 220,
      },
      {
        field: "courseDuration",
        headerName: "Course Duration",
        headerAlign: "center",
        align: "left",
        width: 140,
        maxWidth: 160,
      },
      {
        field: "courseTerms",
        headerName: "Terms",
        headerAlign: "center",
        align: "left",
        width: 100,
        maxWidth: 120,
      },
      {
        field: "courseCreditUnits",
        headerName: "Credit Units",
        headerAlign: "center",
        align: "left",
        width: 100,
        maxWidth: 120,
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
          pageTitle={"Course Records"}
          onButtonClick={openRegisterDialog}
          buttonLabel={"Add Course"}
        />
        <GridWrapper
          isDatafetched={isDataFetched}
          rows={courses}
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
              dialogHeading={"Register Course"}
            >
              <DialogContent>
                {registerError && (
                  <Box mb={2}>
                    <Typography color="error" variant="body2">
                      {registerError?.requiredFieldError}
                    </Typography>
                  </Box>
                )}
                <FormFieldsStack>
                  <TextField
                    size="small"
                    label="Course Code"
                    required
                    variant="outlined"
                    name="courseCode"
                    error={!!registerError?.courseCodeError}
                    helperText={registerError?.courseCodeError}
                    value={registerForm?.courseCode || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <TextField
                    size="small"
                    label="Course Title"
                    required
                    error={!!registerError?.courseTitleError}
                    helperText={registerError?.courseTitleError}
                    variant="outlined"
                    name="courseTitle"
                    value={registerForm?.courseTitle || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <TextField
                    size="small"
                    label="Course Duration (YYYY-YYYY)"
                    required
                    select
                    error={!!registerError?.courseDurationError}
                    helperText={registerError?.courseDurationError}
                    variant="outlined"
                    name="courseDuration"
                    value={registerForm?.courseDuration || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    {durationoptions.map((item) => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    size="small"
                    label="Terms"
                    required
                    select
                    error={!!registerError?.courseTermError}
                    helperText={registerError?.courseTermError}
                    variant="outlined"
                    name="courseTerms"
                    value={registerForm?.courseTerms || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    {semesterOptions.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    size="small"
                    label="Credit Units"
                    required
                    variant="outlined"
                    name="courseCreditUnits"
                    type="number"
                    error={!!registerError?.courseCreditError}
                    helperText={registerError?.courseCreditError}
                    value={registerForm?.courseCreditUnits || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: Number(e.target.value),
                      })
                    }
                  />
                  {/* Add more fields as needed */}
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
                    <Typography variant="h6" color="error">
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
                    onClick={() => handleRegisterCourse(registerForm)}
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
        {isUpdateDialogOpen && selectedCourse && (
          <FormDialogWrapper
            isDialogOpen={isUpdateDialogOpen}
            closeDialog={closeUpdateDialog}
            dialogHeading={"Update Course"}
          >
            <DialogContent>
              {updateError && (
                <Box mb={2}>
                  <Typography color="error" variant="body2">
                    {updateError?.requiredFieldError}
                  </Typography>
                </Box>
              )}
              <FormFieldsStack>
                <TextField
                  size="small"
                  label="Course Code"
                  name="courseCode"
                  error={!!updateError?.courseCodeError}
                  helperText={updateError?.courseCodeError}
                  value={selectedCourse?.courseCode || ""}
                  onChange={(e) =>
                    setSelectedCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  size="small"
                  label="Course Title"
                  name="courseTitle"
                  error={!!updateError?.courseTitleError}
                  helperText={updateError?.courseTitleError}
                  value={selectedCourse?.courseTitle || ""}
                  onChange={(e) =>
                    setSelectedCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  size="small"
                  label="Course Duration (YYYY-YYYY)"
                  name="courseDuration"
                  select
                  error={!!updateError?.courseDurationError}
                  helperText={updateError?.courseDurationError}
                  value={selectedCourse?.courseDuration || ""}
                  onChange={(e) =>
                    setSelectedCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                >
                  {durationoptions.map((item) => (
                    <MenuItem value={item.value} key={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Terms"
                  size="small"
                  name="courseTerms"
                  select
                  error={!!updateError?.courseTermError}
                  helperText={updateError?.courseTermError}
                  value={selectedCourse?.courseTerms || ""}
                  onChange={(e) =>
                    setSelectedCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                >
                  {semesterOptions.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  label="Credit Units"
                  name="courseCreditUnits"
                  type="number"
                  error={!!updateError?.courseCreditError}
                  helperText={updateError?.courseCreditError}
                  value={selectedCourse?.courseCreditUnits || ""}
                  onChange={(e) =>
                    setSelectedCourse((prev) => ({
                      ...prev,
                      [e.target.name]: Number(e.target.value),
                    }))
                  }
                />
                {/* Add more fields as needed */}
              </FormFieldsStack>
            </DialogContent>
            {/* Update Validation Error */}
            {validationError && (
              <Box>
                <Typography variant="h6" color="error">
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
                  onClick={() => handleUpdateCourse(selectedCourse)}
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
        {isDeleteDialogOpen && selectedCourse && (
          <FormDialogWrapper
            sx={{ height: "32vh" }}
            isDialogOpen={isDeleteDialogOpen}
            closeDialog={closeDeleteDialog}
            dialogHeading={"Remove Course"}
          >
            <DeleteConfirmationDialogContent
              onConfirm={() => handleDeleteCourse(selectedCourse)}
              onCancel={closeDeleteDialog}
              entityName={selectedCourse?.courseTitle}
            />
          </FormDialogWrapper>
        )}
      </Box>
    </Box>
  );
};

export default Course;
