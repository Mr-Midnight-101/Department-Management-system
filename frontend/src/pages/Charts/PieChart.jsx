import React from "react";
import Unavailable from "../../components/Unavailable";

const PieChart = () => {
  return (
    <div style={{
        width: "100%",
        height: "80%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Unavailable moduleName={"Pie chart"} />
    </div>
  );
};

export default PieChart;
