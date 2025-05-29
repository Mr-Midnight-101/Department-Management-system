import React from "react";
import { Outlet } from "react-router-dom";
import Bar from "../pages/Bars/Bar.jsx";
import TopBar from "../pages/Bars/TopBar.jsx";
import '../App.css'
const Layout = () => {
  return (
    <div className="app">
      <Bar />
      <main className="content">
        <TopBar />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
