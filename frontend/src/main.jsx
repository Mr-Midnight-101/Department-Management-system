import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
//inject the css-js styling to override  the css MUI 
import { StyledEngineProvider } from "@mui/material/styles";
createRoot(document.getElementById("root")).render(
  <StyledEngineProvider>
    <App />
  </StyledEngineProvider>
);
