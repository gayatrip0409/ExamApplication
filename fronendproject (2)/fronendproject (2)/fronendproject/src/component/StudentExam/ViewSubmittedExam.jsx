import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ViewSubmittedExam() {
  const { examId } = useParams();
  const studentId = localStorage.getItem("userid");
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentId || !examId) {
      setError("⚠️ Missing student or exam ID.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/student/${studentId}/exam/${examId}/viewsubmitexam`)
      .then((res) => {
        setExam(res.data?.result[0] || null);
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to load exam result.");
      })
      .finally(() => setLoading(false));
  }, [studentId, examId]);

  if (loading) return <div className="text-primary ps-3">Loading...</div>;
  if (error) return <div className="text-danger ps-3">{error}</div>;
  if (!exam) return <div className="alert alert-warning">No exam data found.</div>;

  return (
    <div className="container mt-4">
      <h3 className="text-center text-primary mb-3">📄 Exam Summary</h3>

      <div className="card shadow border-0">
        <div className="card-body">
          <h5 className="card-title">{exam.title}</h5>
          <p className="card-text">
            <strong>Score:</strong> {exam.score}/{exam.total_marks}
          </p>
          <p className="card-text">
            <strong>Percentage:</strong> {exam.percentage.toFixed(2)}%
          </p>
          <p className="card-text">
            <strong>Start:</strong>{" "}
            {exam.start_time ? new Date(exam.start_time).toLocaleString() : "N/A"}
          </p>
          <p className="card-text">
            <strong>End:</strong>{" "}
            {exam.end_time ? new Date(exam.end_time).toLocaleString() : "N/A"}
          </p>

          {/* Navigate to full details */}
          <div className="text-center mt-3">
            <button
              className="btn btn-success"
              onClick={() => navigate(`/student/exam/result/${examId}/detail`)}
            >
              View Full Details (With Answers)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
