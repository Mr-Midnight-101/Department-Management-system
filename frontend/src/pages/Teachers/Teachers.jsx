/* eslint-disable no-unused-vars */
import {
  Box,
  useTheme,
} from "@mui/material";
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
    const response = await getAllTeachers();
    const mappedRow = response.map((teach, i) => ({
      ...teach,
      id: teach._id,
      index: i + 1,
    }));
    setTeachers(mappedRow);
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);
  //⭐ validation

  const columns = useMemo(
    () => [
      {
        field: "index",
        header: "S.no.",
      },
      {
        field: "teacherFullName",
        header: "Name",
      },
      {
        field: "teacherEmail",
        header: "Email",
        headerAlign: "center",
      },
      {
        field: "teacherUsername",
        header: "Username",
      },
      {
        field: "teacherAssignedSubjects",
        header: "Subjects",
      },
      {
        field: "teacherContactInfo",
        header: "Contact",
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
