import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ExamService from "../../services/examservice";

export default function ViewExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 6;
  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = () => {
    setLoading(true);
    ExamService.getAllExams()
      .then((response) => {
        const sortedExams = (response.data.result || []).sort(
          (a, b) => a.exam_id - b.exam_id
        );
        setExams(sortedExams);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch exams.");
        setLoading(false);
      });
  };

  // 🔄 Live Search (with native debounce)
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (searchName.trim() === "") {
        fetchExams();
      } else {
        setLoading(true);
        ExamService.searchExamByName(searchName)
          .then((response) => {
            const sortedExams = (response.data.result || []).sort(
              (a, b) => a.exam_id - b.exam_id
            );
            setExams(sortedExams);
            setLoading(false);
            setCurrentPage(1);
          })
          .catch(() => {
            setError("Failed to search exams.");
            setLoading(false);
          });
      }
    }, 500); // debounce delay in ms

    return () => clearTimeout(debounceTimeout.current);
  }, [searchName]);

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(exams.length / examsPerPage);

  const viewExam = (exam_id) => {
    navigate(`/admin/view-exam/${exam_id}`);
  };

  const updateExam = (exam) => {
    navigate(`/admin/update-exam/${exam.exam_id}`);
  };

  const deleteExam = (exam_id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Please login.");
      return;
    }

    ExamService.deleteExamById(exam_id, token)
      .then(() => {
        alert("Exam deleted successfully.");
        fetchExams();
      })
      .catch(() => {
        alert("Failed to delete exam.");
      });
  };

  if (loading) return <p className="text-center mt-4">Loading exams...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header text-white" style={{ backgroundColor: "#969ec7da" }}>
          <h4 className="mb-0">Exams List</h4>
          <div className="d-flex mt-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search by exam name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setSearchName("");
                fetchExams();
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="card-body">
          {exams.length === 0 ? (
            <p>No exams available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Sr.No</th>
                    <th>Title</th>
                    <th>Total Marks</th>
                    <th>Duration (hrs)</th>
                    <th>User ID</th>
                    <th>Created At</th>
                    <th>Course ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentExams.map((exam, index) => (
                    <tr key={exam.exam_id}>
                      <td>{indexOfFirstExam + index + 1}</td>
                      <td>{exam.title}</td>
                      <td>{exam.total_marks}</td>
                      <td>{exam.duration}</td>
                      <td>{exam.userid}</td>
                      <td>{new Date(exam.created_at).toLocaleString()}</td>
                      <td>{exam.course_id}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => viewExam(exam.exam_id)}
                          title="View"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => updateExam(exam)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteExam(exam.exam_id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                  Prev
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button onClick={() => setCurrentPage(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
