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

// Example dropdown options (customize as needed)
const semesterOptions = [
  { value: 1, label: "Semester 1" },
  { value: 2, label: "Semester 2" },
  { value: 3, label: "Semester 3" },
  { value: 4, label: "Semester 4" },
  { value: 5, label: "Semester 5" },
  { value: 6, label: "Semester 6" },
  { value: 7, label: "Semester 7" },
  { value: 8, label: "Semester 8" },
];

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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Update Dialog open/close handlers
  const openUpdateDialog = (course) => {
    setSelectedCourse(course);
    setUpdateDialogOpen(true);
  };
  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setRefreshTable((prev) => !prev);
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
    setRegisterError("");
    setRegisterLoading(true);
    // Add validation as needed
    try {
      const response = await createCourse(formData);
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

  const handleUpdateCourse = async (course) => {
    setUpdateError("");
    setUpdateLoading(true);
    // Add validation as needed
    try {
      const updated = await updateCourse(course);
      if (!updated) {
        setUpdateError("Failed to update course");
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
                      {registerError}
                    </Typography>
                  </Box>
                )}
                <FormFieldsStack>
                  <TextField
                    size="medium"
                    label="Course Code"
                    required
                    variant="outlined"
                    name="courseCode"
                    value={registerForm.courseCode || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <TextField
                    size="medium"
                    label="Course Title"
                    required
                    variant="outlined"
                    name="courseTitle"
                    value={registerForm.courseTitle || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <TextField
                    size="medium"
                    label="Course Duration (YYYY-YYYY)"
                    required
                    variant="outlined"
                    name="courseDuration"
                    value={registerForm.courseDuration || ""}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <TextField
                    size="medium"
                    label="Terms"
                    required
                    select
                    variant="outlined"
                    name="courseTerms"
                    value={registerForm.courseTerms || ""}
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
                    size="medium"
                    label="Credit Units"
                    required
                    variant="outlined"
                    name="courseCreditUnits"
                    type="number"
                    value={registerForm.courseCreditUnits || ""}
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
              <Box display="flex" justifyContent="center">
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
                  <Typography color="error" variant="h6">
                    {updateError}
                  </Typography>
                </Box>
              )}
              <FormFieldsStack>
                <TextField
                  label="Course Code"
                  name="courseCode"
                  value={selectedCourse?.courseCode || ""}
                  onChange={(e) =>
                    setSelectedCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Course Title"
                  name="courseTitle"
                  value={selectedCourse?.courseTitle || ""}
                  onChange={(e) =>
                    setSelectedCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Course Duration (YYYY-YYYY)"
                  name="courseDuration"
                  value={selectedCourse?.courseDuration || ""}
                  onChange={(e) =>
                    setSelectedCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Terms"
                  name="courseTerms"
                  select
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
                  label="Credit Units"
                  name="courseCreditUnits"
                  type="number"
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
