/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Unavailable from "../../components/Unavailable";
import { getAllAttendance } from "../../services/attendance.js";

const Attendance = () => {
  useEffect(() => {
    const fetchAttendance = async () => {
      await getAllAttendance().then((prev) =>
        setUserName(prev.attendanceStudent)
      );
    };
    fetchAttendance();
  }, []);
  const [userName, setUserName] = useState("");
  console.log(userName);
  
  return (
    <div
      style={{
        width: "100%",
        height: "80%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Unavailable moduleName={"Attendance"} />
      <Box>{userName}</Box>
    </div>
  );
};

export default Attendance;
