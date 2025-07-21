/* eslint-disable no-unused-vars */
import { Box, IconButton, TextField, Typography } from "@mui/material";
import PageSectionWrapper from "../../components/PageSectionWrapper.jsx";
import GridWrapper from "../../components/GridWrapper.jsx";
import { useMemo, useState } from "react";

const Attendance = () => {
  const [rows, setRows] = useState([]);
  const [course, setCourse] = useState([]);
  const [semester, setSemester] = useState([]);

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
      {},
    ],
    []
  );
  return (
    <Box>
      <PageSectionWrapper>
        <Box>
          <TextField>
            {course.map((item) => {
              console.log(item);
            })}
          </TextField>
          <TextField>
            {semester.map((item) => {
              console.log(item);
            })}
          </TextField>
          <IconButton>
            <Typography>Search</Typography>
          </IconButton>
        </Box>
        <GridWrapper columns={columns} rows={rows}></GridWrapper>
      </PageSectionWrapper>
    </Box>
  );
};

export default Attendance;
