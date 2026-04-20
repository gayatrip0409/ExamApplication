import React from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaClipboardList,
  FaQuestionCircle,
  FaCalendarAlt,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/sidebar.css";

const sections = [
  {
    title: "Course",
    icon: <FaBook />,
    links: [
      { to: "/admin/add-course", label: "Add Course" },
      { to: "/admin/view-course", label: "View Course" },
    ],
  },
  {
    title: "Exams",
    icon: <FaClipboardList />,
    links: [
      { to: "/admin/add-exam", label: "Add Exam" },
      { to: "/admin/view-exams", label: "View Exams" },
      { to: "/admin/assign-exam", label:"Assign Exam"},
    ],
  },
  {
    title: "Question",
    icon: <FaQuestionCircle />,
    links: [
      { to: "/admin/add-question", label: "Add Question" },
      { to: "/admin/view-question", label: "View Question" }, 
      { to: "/admin/assign-question", label: "Assign Question" }, 
      { to: "/admin/view-assigned-questions",label: "View Assigned Questions"}
    ],
  },
  {
    title: "Schedule",
    icon: <FaCalendarAlt />,
    links: [
      { to: "/admin/add-schedule", label: "Add Exam Schedule" },
      { to: "/admin/view-schedule", label: "View Exam Schedule" },
    ],
  },
  /*{
    title: "Result",
    icon: <FaChartBar />,
    links: [
      { to: "/admin/add-result", label: "Add Result" },
      { to: "/admin/view-results", label: "View Results" },
    ],
  },*/
];

export default function Sidebar({ handleLogout, isOpen, toggleSidebar }) {
  return (
    <div
      className={`sidebar-custom text-white p-3 shadow ${
        isOpen ? "d-block" : "d-none"
      } d-md-block`}
    >
      {/* Logo */}
      <h2 className="text-center fw-bold mb-4">Admin</h2>

      {/* Bootstrap Accordion for sections */}
      <div className="accordion" id="sidebarAccordion">
        {sections.map((section, index) => (
          <div
            className="accordion-item bg-transparent border-0"
            key={section.title}
          >
            <h2 className="accordion-header" id={`heading-${index}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded="false"
                aria-controls={`collapse-${index}`}
              >
                <span className="me-2">{section.icon}</span> {section.title}
              </button>
            </h2>
            <div
              id={`collapse-${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#sidebarAccordion"
            >
              <div className="accordion-body p-2">
                {section.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="d-block text-white text-decoration-none py-1 ps-3 rounded hover-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button
        className="btn btn-danger w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
        onClick={handleLogout}
      >
        <FaSignOutAlt /> Logout
      </button>

      {/* Collapse button for mobile */}
      <div className="d-md-none mt-3 text-center">
        <button className="btn btn-outline-light" onClick={toggleSidebar}>
          Close Menu
        </button>
      </div>
    </div>
  );
}
