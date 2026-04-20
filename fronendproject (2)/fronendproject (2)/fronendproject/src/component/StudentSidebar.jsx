import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentResultLinks from "./StudentExam/StudentResultLinks";

const sections = [
  {
    title: "Dashboard",
    icon: <FaHome />,
    links: [{ to: "/student", label: "Overview" }],
  },
  {
    title: "Courses",
    icon: <FaBook />,
    links: [{ to: "/student/viewstudentcourse", label: "My Courses" }],
  },
  {
    title: "Exams",
    icon: <FaClipboardList />,
    links: [{ to: "/student/exams", label: "My Exams" }],
  },
   {
     title: "Result",
     icon: <FaClipboardList />,
    links: [{ to: "/student/results", label: "View Results" }],
 },
];

export default function StudentSidebar({ handleLogout, isOpen, toggleSidebar }) {
  return (
    <div
      className={`sidebar-custom text-white p-3 shadow ${
        isOpen ? "d-block" : "d-none"
      } d-md-block`}
      style={{ backgroundColor: "#003366", minHeight: "100vh" }}
    >
      <h3 className="text-center fw-bold mb-4">Student</h3>

      <div className="accordion" id="studentSidebarAccordion">
        {sections.map((section, index) => (
          <div className="accordion-item bg-transparent border-0" key={section.title}>
            <h2 className="accordion-header" id={`heading-${index}`}>
              <button
                className="accordion-button collapsed text-white bg-transparent"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded="false"
                aria-controls={`collapse-${index}`}
                style={{ fontWeight: "bold" }}
              >
                <span className="me-2">{section.icon}</span>
                {section.title}
              </button>
            </h2>
            <div
              id={`collapse-${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#studentSidebarAccordion"
            >
              {section.links ? (
                <div className="accordion-body p-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="d-block text-white text-decoration-none py-1 ps-3 rounded hover-link"
                      onClick={toggleSidebar}
                      style={{ backgroundColor: "#004080" }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : section.dynamicComponent ? (
                section.dynamicComponent
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-danger w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
        onClick={handleLogout}
      >
        <FaSignOutAlt /> Logout
      </button>

      <div className="d-md-none mt-3 text-center">
        <button className="btn btn-outline-light" onClick={toggleSidebar}>
          Close Menu
        </button>
      </div>
    </div>
  );
}
