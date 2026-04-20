import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentAssignedExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [startedExams, setStartedExams] = useState([]); // ✅ track started exams
  const navigate = useNavigate();

  const studentId = localStorage.getItem("userid");

  useEffect(() => {
    if (!studentId) {
      setMessage("⚠️ No student ID found. Please login again.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/student/${studentId}/examassign`)
      .then((res) => {
        if (Array.isArray(res.data.result)) {
          setExams(res.data.result);
          setMessage("");
        } else {
          setMessage("No exams scheduled.");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data?.msg) {
          setMessage("❌ " + err.response.data.msg);
        } else {
          setMessage("❌ Failed to fetch exams.");
        }
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  const handleStartTest = (examId, duration) => {
    // ✅ mark as started
    setStartedExams((prev) => [...prev, examId]);

    // redirect to start exam page
    navigate(`/student/exam/start/${examId}`, {
      state: { duration },
    });
  };

  // ✅ Function to check exam status
  const getExamStatus = (exam) => {
    const now = new Date();
    const start = exam.start_time ? new Date(exam.start_time) : null;
    const end = exam.end_time ? new Date(exam.end_time) : null;

    if (exam.is_submitted === 1) {
      return <span className="badge bg-success">✅ Completed</span>;
    }

    if (!start || !end) {
      return <span className="badge bg-secondary">Not Scheduled</span>;
    }

    if (now < start) {
      return <span className="badge bg-warning text-dark">Not Started</span>;
    }

    if (now > end) {
      return <span className="badge bg-danger">Expired</span>;
    }

    // ✅ Exam available → show Start Test button
    if (startedExams.includes(exam.exam_id)) {
      return (
        <button className="btn btn-secondary btn-sm" disabled>
          In Progress...
        </button>
      );
    }

    return (
      <button
        className="btn btn-success btn-sm"
        onClick={() => handleStartTest(exam.exam_id, exam.duration)}
      >
        Start Test
      </button>
    );
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">📚 My Assigned Exams</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2">Loading exams...</p>
            </div>
          ) : exams.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Exam Title</th>
                    <th>Total Marks</th>
                    <th>Duration</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.assignment_id}>
                      <td>{exam.title}</td>
                      <td>{exam.total_marks}</td>
                      <td>{exam.duration} min</td>
                      <td>
                        {exam.start_time
                          ? new Date(exam.start_time).toLocaleString()
                          : "Not Scheduled"}
                      </td>
                      <td>
                        {exam.end_time
                          ? new Date(exam.end_time).toLocaleString()
                          : "Not Scheduled"}
                      </td>
                      <td>{getExamStatus(exam)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info text-center">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignedExams;
