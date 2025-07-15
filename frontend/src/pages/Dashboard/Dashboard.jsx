/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import RecentActivity from "./RecentActivity";
import PageSectionWrapper from "../../components/PageSectionWrapper";
import GlassEffect from "../../components/GlassEffect";
import axios from "axios";

const Dashboard = () => {
  const [Faculty, setFaculty] = useState(0);
  const [Enrolled, setEnrolled] = useState(0);
  const [Courses, setCourses] = useState(0);
  const [Academic, setAcademic] = useState(0);
  const fetchDocuments = async () => {
    const response = await axios
      .get("/api/v1/count-doc")
      .then((response) => response?.data?.data);
    setAcademic(response?.subjects);
    setCourses(response?.courses);
    setEnrolled(response?.students);
    setFaculty(response?.teachers);
  };

  useEffect(() => {
    fetchDocuments();
  }, [Faculty]);
  return (
    <PageSectionWrapper>
      <Box display="flex" flexWrap="wrap" gap={1} width="100%" flexGrow="1">
        <GlassEffect sx={{ flex: "1" }}>
          <Box textAlign="center">
            <Typography variant="h4"> {Faculty}</Typography>
            <Typography variant="h5">Faculty Members</Typography>
          </Box>
        </GlassEffect>
        <GlassEffect sx={{ flex: "1" }}>
          <Box textAlign="center">
            <Typography variant="h4"> {Enrolled}</Typography>
            <Typography variant="h5">Enrolled Students</Typography>
          </Box>
        </GlassEffect>
        <GlassEffect sx={{ flex: "1" }}>
          <Box textAlign="center">
            <Typography variant="h4"> {Courses}</Typography>
            <Typography variant="h5">Available Courses</Typography>
          </Box>
        </GlassEffect>
        <GlassEffect sx={{ flex: "1" }}>
          <Box textAlign="center">
            <Typography variant="h4"> {Academic}</Typography>
            <Typography variant="h5"> Academic Subjects</Typography>
          </Box>
        </GlassEffect>
      </Box>
    </PageSectionWrapper>
  );
};

export default Dashboard;
