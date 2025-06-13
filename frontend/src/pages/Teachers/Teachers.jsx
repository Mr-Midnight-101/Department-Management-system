/* eslint-disable no-unused-vars */
import { Box, useTheme } from "@mui/material";
import PageSectionWrapper from "../../components/PageSectionWrapper";
import GridHeaderWithAction from "../../components/GridHeaderWithAction";
import GridWrapper from "../../components/GridWrapper";
import { useCallback, useEffect, useMemo, useState } from "react";
// import { getColorTokens } from "../../theme/theme";
import { getAllTeachers } from "../../services/teacher";

const Teachers = () => {
  //⭐ row of teachers in [], setting using fetch
  const [teachers, setTeachers] = useState([]);

  //⭐ fetch teacher
  const fetchTeachers = useCallback(async () => {
    try {
      const response = await getAllTeachers();
    const mappedRow = response.map((teach, i) => ({
      ...teach,
      id: teach._id,
      index: i + 1,
    }));
    setTeachers(mappedRow);
    } catch (error) {
      console.log(error);
      
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);
  //⭐ validation

  const columns = useMemo(
    () => [
      {
        field: "index",
        headerName: "S.No.",
        width: 80,
        maxWidth: 80,
      },
      {
        field: "teacherFullName",
        headerName: "Name",
      },
      {
        field: "teacherEmail",
        headerName: "Email",
        headerAlign: "center",
      },
      {
        field: "teacherUsername",
        headerName: "Username",
      },
      {
        field: "teacherAssignedSubjects",
        headerName: "Subjects",
      },
      {
        field: "teacherContactInfo",
        headerName: "Contact",
      },
    ],
    []
  );
  return (
    <Box width="100%">
      <PageSectionWrapper>
        <GridHeaderWithAction pageTitle={"Teacher Datasets"} />
        <GridWrapper columns={columns} rows={teachers} isDatafetched={true} />
      </PageSectionWrapper>
    </Box>
  );
};

export default Teachers;
