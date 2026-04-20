import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored tokens/session
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column flex-md-row vh-100">
      {/* Sidebar */}
      <StudentSidebar
        handleLogout={handleLogout}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Content Area */}
      <div className="flex-grow-1 p-3 content-area overflow-auto">
        {/* Toggle button visible only on small screens */}
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
