import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StudentResultLinks() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const studentId = localStorage.getItem("userid");

  useEffect(() => {
    if (!studentId) {
      setError("⚠️ Student ID not found.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/student/${studentId}/view-all-submitted-exams`)
      .then((res) => {
        setResults(res.data?.results || []);
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to load results.");
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <div className="text-primary ps-3">Loading...</div>;
  if (error) return <div className="text-danger ps-3">{error}</div>;

  return (
    <div className="container mt-4">
      <h3 className="text-center text-primary mb-4">📊 My Exam Results</h3>

      {results.length === 0 ? (
        <div className="alert alert-info text-center">No results available.</div>
      ) : (
        <div className="row">
          {results.map((exam) => (
            <div className="col-md-6 col-lg-4 mb-3" key={exam.result_id}>
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title text-dark">{exam.title}</h5>
                  <p className="card-text mb-1">
                    <strong>Score:</strong> {exam.score}/{exam.total_marks}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Percentage:</strong> {exam.percentage.toFixed(2)}%
                  </p>
                  <p className="card-text mb-1">
                    <strong>Start:</strong>{" "}
                    {exam.start_time
                      ? new Date(exam.start_time).toLocaleString()
                      : "N/A"}
                  </p>
                  <p className="card-text">
                    <strong>End:</strong>{" "}
                    {exam.end_time
                      ? new Date(exam.end_time).toLocaleString()
                      : "N/A"}
                  </p>

                  {/* Link goes to summary first */}
                  <Link
                    to={`/student/exam/result/${exam.exam_id}`}
                    className="btn btn-outline-primary w-100"
                  >
                    View Summary
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
