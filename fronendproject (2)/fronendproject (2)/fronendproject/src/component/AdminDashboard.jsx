import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminDashboard({ handleLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="d-flex flex-column flex-md-row vh-100">
      {/* Sidebar */}
      <Sidebar
        handleLogout={handleLogout}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Content Area */}
      <div className="flex-grow-1 p-3 content-area overflow-auto">
        <div className="d-md-none mb-2">
          <button
            className="btn btn-primary w-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Hide Menu" : "Show Menu"}
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
