import React from "react";
import Unavailable from "../../components/Unavailable";

const Attendance = () => {
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
    </div>
  );
};

export default Attendance;
