/* eslint-disable no-unused-vars */
import "./App.css";
import { ThemeModeContext, useThemeMode } from "./theme/theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Students from "./pages/Students/Students.jsx";
import Course from './pages/Course/Course.jsx'
import Subjects from "./pages/Subjects/Subjects.jsx";
import Teachers from "./pages/Teachers/Teachers.jsx";
import Attendance from "./pages/Attendance/Attendance.jsx";
import PieChart from './pages/Charts/PieChart.jsx'
import BarChart from './pages/Charts/BarChart.jsx'
import LineChart from './pages/Charts/LineChart.jsx'

function App() {
  const [theme, colorMode] = useThemeMode();
  return (
    <ThemeModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route to="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/student" element={<Students />} />
              <Route path="/course" element={<Course />} />
              <Route path="/subject" element={<Subjects />} />
              <Route path="/teacher" element={<Teachers />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/barchart" element={<BarChart />} />
              <Route path="/piechart" element={<PieChart />} />
              <Route path="/linechart" element={<LineChart />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default App;
