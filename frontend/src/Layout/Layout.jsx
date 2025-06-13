import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Bar from "../pages/Bars/Bar.jsx";
import TopBar from "../pages/Bars/TopBar.jsx";
import "../App.css";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="app"
      style={{
        display: "flex",
        maxWidth: "100vw",
        height: "100vh",
      }}
    >
      <Bar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="content"
        style={{
          flex: 1,
          marginLeft: collapsed ? "65px" : "0px",
          transition: "margin-left 0.3s ease",
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <TopBar />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
