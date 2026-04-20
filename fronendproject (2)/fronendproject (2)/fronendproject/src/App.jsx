import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import AdminDashboard from "./component/AdminDashboard";
import AddCourse from "./component/Course/AddCourse";
import ViewCourse from "./component/Course/ViewCourse";
import AddExam from "./component/Exams/AddExam";
import AssignExam from "./component/Exams/AssignExam.jsx";
import UpdateExam from "./component/Exams/UpdateExam.jsx";
import ViewExams from "./component/Exams/ViewExams";
import ViewSingleExam from './component/Exams/ViewsingleExam.jsx';
import Forgot from "./component/Forgot";
import Home from "./component/Home.jsx";
import Login from "./component/Login.jsx";
import AddQuestion from "./component/Question/AddQuestion";
import AssignQuestion from "./component/Question/AssignQuestion.jsx";
import SearchByCourse from "./component/Question/SearchByCourse.jsx";
import SearchByExam from "./component/Question/SearchByExam";
import ViewAssignedQuestions from "./component/Question/ViewAssignedQuestions.jsx";
import ViewQuestion from "./component/Question/ViewQuestion";
import Register from "./component/Register";
import AddResult from "./component/Result/AddResult";
import ViewResults from "./component/Result/ViewResults";
import AddExamSchedule from "./component/Schedule/AddExamSchedule";
import UpdateSchedule from "./component/Schedule/UpdateSchedule";
import ViewExamSchedule from "./component/Schedule/ViewExamSchedule";
import ViewSingleSchedule from "./component/Schedule/ViewSingleSchedule";

import StudentDashboard from "./component/StudentDashboard";
import ResultDetail from "./component/StudentExam/ResultDetail.jsx";
import StartExamPage from "./component/StudentExam/StartExamPage.jsx";
import StudentAssignedExams from "./component/StudentExam/StudentAssignedExams.jsx";
import StudentResultLinks from "./component/StudentExam/StudentResultLinks.jsx";
import ViewStudentCourse from "./component/StudentExam/ViewStudentCourse.jsx";
import ViewSubmittedExam from "./component/StudentExam/ViewSubmittedExam.jsx";


import './App.css';

const scrollToSection = (id, navigate) => {
  navigate('/home'); // Always go to home
  setTimeout(() => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100); // wait a bit to ensure DOM is rendered
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize login state & role from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setRole("");
    setMenuOpen(false);
    navigate("/home");
  };

  // Check if current route is inside admin or student dashboard
  const isDashboard = location.pathname.startsWith("/admin") || location.pathname.startsWith("/student");

  const StudentExamsWrapper = () => {
  const navigate = useNavigate();
  const studentId = localStorage.getItem("userid"); 

  if (!studentId) {
    return (
      <div className="alert alert-warning text-center my-5">
        You must be logged in to see assigned exams.
      </div>
    );
  }

  return <StudentAssignedExams studentId={studentId} navigate={navigate} />;
};


  return (
    <div className="app-container">

      {/* Navbar always visible */}
      <nav className="navbar">
        <div className="navbar-title">ExamApp</div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {!isDashboard ? (
            !isLoggedIn ? (
              <>
                <a onClick={() => { scrollToSection("home", navigate); setMenuOpen(false); }}>Home</a>
                <a onClick={() => { scrollToSection("about", navigate); setMenuOpen(false); }}>About</a>
                <a onClick={() => { scrollToSection("services", navigate); setMenuOpen(false); }}>Service</a>
                <a onClick={() => { scrollToSection("contact", navigate); setMenuOpen(false); }}>Contact</a>

                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>SignUp</Link>
              </>
            ) : (
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )
          ) : (
            // Inside dashboard only show Logout button
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <main className="main-layout">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<h2>About Page</h2>} />
          <Route path="/features" element={<h2>Features Page</h2>} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />

          {/* Protected Admin Dashboard Routes */}
          <Route
            path="/admin/*"
            element={
              role?.toLowerCase()=== "admin" ? (
                <AdminDashboard handleLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route index element={<h3>Welcome to the Admin Dashboard!</h3>} />
            <Route path="add-question" element={<AddQuestion />} />
            <Route path="view-question" element={<ViewQuestion />} />
            <Route path="add-schedule" element={<AddExamSchedule />} />
            <Route path="view-schedule" element={<ViewExamSchedule />} />
            <Route path="add-result" element={<AddResult />} />
            <Route path="view-results" element={<ViewResults />} />
            <Route path="add-exam" element={<AddExam />} />
            <Route path="view-exams" element={<ViewExams />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="view-course" element={<ViewCourse />} />
            <Route path="update-schedule/:id" element={<UpdateSchedule />} />
            <Route path="view-schedule/:id" element={<ViewSingleSchedule />} />
            <Route path="update-exam/:id" element={<UpdateExam />} />
            <Route path="view-exam/:exam_id" element={<ViewSingleExam />} />
            <Route path="assign-exam" element={<AssignExam/>} />
            <Route path="assign-question" element={<AssignQuestion />} />
            <Route path="search-exam-questions" element={<SearchByExam />} />
            <Route path="search-course-questions" element={<SearchByCourse />} />
            <Route path="view-assigned-questions" element={<ViewAssignedQuestions />} />

          </Route>

          {/* Student Dashboard Routes */}
          <Route
  path="/student/*"
  element={
    role?.toLowerCase() === "student" ? (
      <StudentDashboard handleLogout={handleLogout} />
    ) : (
      <Navigate to="/login" />
    )
  }
>
  <Route index element={<h3>Welcome to the Student Dashboard!</h3>} /> 
  <Route path="viewstudentcourse" element={<ViewStudentCourse/>} />
  <Route path="exams" element={<StudentExamsWrapper/>} /> 
  <Route path="exam/start/:examId" element={<StartExamPage />} />
  <Route path="exam/result/:examId" element={<ViewSubmittedExam />} />
  <Route path="results" element={<StudentResultLinks />} />
  <Route path="exam/result/:exam_id/detail" element={<ResultDetail />} />


  
  


</Route>

          
        </Routes>
      </main>

      <footer style={{ backgroundColor: "#003366" }} className="text-white text-center py-3 mt-auto">
        © 2025 Exam Management System. All rights reserved.
      </footer>

    </div>
  );
}
