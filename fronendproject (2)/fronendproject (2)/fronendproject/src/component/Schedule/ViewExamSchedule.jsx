import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Format date-time function
function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  const formattedDate = date.toLocaleDateString("en-GB");
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${formattedDate.replace(/\//g, "-")} ${time}`;
}

export default function ViewExamSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchSchedules();

    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  }, []);

  // Fetch all schedules
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/schedule/getallSchedule"
      );
      setSchedules(response.data.result || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to fetch schedules.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete a schedule
  const deleteSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/delete/schedule/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchSchedules(); // Refresh after deletion
    } catch (err) {
      console.error("Failed to delete schedule:", err);
      alert("Error deleting schedule");
    }
  };

  // Navigate to update page
  const updateSchedule = (schedule) => {
    navigate(`/admin/update-schedule/${schedule.schedule_id}`);
  };

  // Navigate to view single schedule page
  const viewSchedule = (schedule) => {
    navigate(`/admin/view-schedule/${schedule.schedule_id}`);
  };

  // Search schedules by date
  const handleSearch = async () => {
    if (!searchDate) {
      alert("Please select a date.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/schedule/bydate/${searchDate}`
      );

      if (response.data && response.data.result && response.data.result.length > 0) {
        setSchedules(response.data.result);
        setError(null);
        setCurrentPage(1); // Reset to page 1
      } else {
        setSchedules([]);
        setError("No schedule found for the selected date.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSchedules([]);
      setError("No schedule found or error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const currentData = schedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Render pagination UI
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === currentPage ? "active" : ""}`}>
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    return (
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
          </li>
          {pages}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  if (loading) return <p className="text-center mt-4">Loading schedules...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow">
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show m-3" role="alert">
            {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage(null)}
            ></button>
          </div>
        )}

        <div className="card-header text-white" style={{ backgroundColor: "#311c62ff" }}>
          <h4 className="mb-0">Schedules List</h4>
        </div>

        <div className="card-body">
          <div className="mb-4 d-flex align-items-center flex-wrap">
            <label className="form-label me-2 mb-0">Search Schedule by Date:</label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="form-control d-inline-block w-auto me-2"
            />
            <button onClick={handleSearch} className="btn btn-secondary me-2">
              Search
            </button>
            {searchDate && (
              <button
                onClick={() => {
                  setSearchDate("");
                  fetchSchedules();
                }}
                className="btn btn-outline-secondary"
              >
                Clear
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Schedule ID</th>
                  <th>Exam ID</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th style={{ minWidth: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No schedules found.
                    </td>
                  </tr>
                ) : (
                  currentData.map((s) => (
                    <tr key={s.schedule_id || `${s.exam_id}-${s.start_time}`}>
                      <td>{s.schedule_id}</td>
                      <td>{s.exam_id}</td>
                      <td>{formatDateTime(s.start_time)}</td>
                      <td>{formatDateTime(s.end_time)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => viewSchedule(s)}
                          title="View"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => updateSchedule(s)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteSchedule(s.schedule_id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {renderPagination()}
        </div>
      </div>
    </div>
  );
}
