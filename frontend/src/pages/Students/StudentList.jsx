/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, MenuItem, Typography } from "@mui/material";
import PageSectionWrapper from "../../components/PageSectionWrapper";
import { useAsyncError, useNavigate } from "react-router-dom";
import { courseList } from "../../services/course";
import GlassEffect from "../../components/GlassEffect";
import PageHeading from "../../components/PageHeading";
function StudentList() {
  const navigate = useNavigate();
  const [coursesList, setCoursesList] = useState([]);
  const fetchCourseList = useCallback(async () => {
    try {
      const res = await courseList().then((data) => data?.data?.data);
      setCoursesList(res);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    fetchCourseList();
  }, [fetchCourseList]);

  const handleClickOnCourse = (selectedCourse) => {
    navigate("/Students", { state: { selectedCourse } });
  };
  return (
    <PageSectionWrapper>
      <PageHeading>Course Enrollment Viewer</PageHeading>
      <Box
        width="100%"
        // bgcolor="red"
        display="flex"
        gap={2}
        flexWrap="wrap"
        // justifyContent="center"
        alignItems="center"
      >
        {coursesList.map((item) => {
          return (
            <MenuItem
              sx={{
                width: {
                  xs: "100%",
                  sm: "48.7%",
                  md: "32%",
                  lg: "24%",
                  //   xl: "24%",
                },
                // backgroundColor: "green",
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                textAlign: "center",
                p: 0,
              }}
              key={item?._id}
              value={item?.courseCode}
            >
              <GlassEffect
                sx={{
                  display: "flex",
                  width: "100%",
                  textAlign: "center",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  m: 0,
                  p: 0,
                }}
                onClick={() => handleClickOnCourse(item)}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, letterSpacing: 2 }}
                >
                  {item?.courseCode}
                </Typography>
              </GlassEffect>
            </MenuItem>
          );
        })}
      </Box>
    </PageSectionWrapper>
  );
}

export default StudentList;
