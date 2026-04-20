import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExamService from "../../services/examservice";

export default function ViewSingleExam() {
  const { exam_id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    ExamService.getExamById(exam_id, token)
      .then((response) => {
        setExam(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching exam:", err);
        setError("Failed to fetch exam details.");
        setLoading(false);
      });
  }, [exam_id]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
        <span className="ms-2">Loading exam details...</span>
      </div>
    );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger">{error}</p>
      </div>
    );

  if (!exam)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>No exam data found.</p>
      </div>
    );

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="card-header bg-primary text-white text-center rounded">
          <h5 className="mb-0">Exam Details</h5>
        </div>
        <div className="card-body px-4">
          <table className="table table-sm table-bordered mb-0">
            <tbody>
              <tr>
                <th>Exam ID</th>
                <td>{exam.exam_id}</td>
              </tr>
              <tr>
                <th>Title</th>
                <td>{exam.title}</td>
              </tr>
              <tr>
                <th>Total Marks</th>
                <td>{exam.total_marks}</td>
              </tr>
              <tr>
                <th>Duration (hrs)</th>
                <td>{exam.duration}</td>
              </tr>
              <tr>
                <th>User ID</th>
                <td>{exam.userid}</td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>{new Date(exam.created_at).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Course ID</th>
                <td>{exam.course_id}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
