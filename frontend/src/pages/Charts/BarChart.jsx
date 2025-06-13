import { Box } from "@mui/material";
import Front from "../Spline/Front";
import Unavailable from "../../components/Unavailable";

const BarChart = () => {
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
      <Unavailable moduleName={"Bar chart"} />
    </div>
  );
};

export default BarChart;
