import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AssignExam = () => {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all students
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/allstudents")
      .then((res) => {
        console.log("Students response:", res.data);
        if (Array.isArray(res.data)) {
          setStudents(res.data);
        } else {
          throw new Error("Invalid student data format");
        }
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setMessage("❌ Failed to fetch students");
      });
  }, []);

  // Fetch all exams
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/exams/getallexams")
      .then((res) => {
        console.log("Exams response:", res.data);
        if (Array.isArray(res.data.result)) {
          setExams(res.data.result);
        } else {
          throw new Error("Invalid exam data format");
        }
      })
      .catch((err) => {
        console.error("Error fetching exams:", err);
        setMessage("❌ Failed to fetch exams");
      });
  }, []);

  // Handle assign
  const handleAssign = () => {
    if (!selectedStudent || !selectedExam) {
      setMessage("⚠️ Please select both student and exam");
      return;
    }

    axios
      .post("http://localhost:5000/api/exams/assign", {
        userid: selectedStudent,
        exam_id: selectedExam,
      })
      .then(() => {
        setMessage("✅ Exam assigned successfully");
        setSelectedStudent("");
        setSelectedExam("");
      })
      .catch((err) => {
        console.error("Assign error:", err);
        if (err.response && err.response.data?.error) {
          setMessage("❌ " + err.response.data.error);
        } else {
          setMessage("❌ Failed to assign exam");
        }
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white text-center">
            <h4 className="mb-0">📌 Assign Exam to Student</h4>
          </div>
          <div className="card-body">
            {/* Student Dropdown */}
            <div className="mb-3">
              <label className="form-label">Select Student:</label>
              <select
                className="form-select"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">-- Select Student --</option>
                {Array.isArray(students) &&
                  students.map((s) => (
                    <option key={s.userid} value={s.userid}>
                      {s.name} ({s.email})
                    </option>
                  ))}
              </select>
            </div>

            {/* Exam Dropdown */}
            <div className="mb-3">
              <label className="form-label">Select Exam:</label>
              <select
                className="form-select"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <option value="">-- Select Exam --</option>
                {Array.isArray(exams) &&
                  exams.map((e) => (
                    <option key={e.exam_id} value={e.exam_id}>
                      {e.title} ({e.total_marks} marks)
                    </option>
                  ))}
              </select>
            </div>

            {/* Assign Button */}
            <button className="btn btn-success w-100" onClick={handleAssign}>
              Assign Exam
            </button>

            {/* Message */}
            {message && (
              <div className="alert alert-info mt-3 text-center">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignExam;
