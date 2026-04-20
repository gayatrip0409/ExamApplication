import React, { useEffect, useState } from "react";
import { getAllCourses, searchCourseByName } from "../../services/courseservice";
import "../styles/viewcourse.css";

export default function ViewStudentCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const result = await getAllCourses();
      setCourses(result);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("❌ Failed to fetch courses.");
      setLoading(false);
    }
  };

  // Debounced live search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchTerm.trim()) {
        fetchCourses(); // If empty, reload all
      } else {
        searchCourseByName(searchTerm.trim())
          .then((result) => {
            if (Array.isArray(result)) {
              setCourses(result);
            } else if (result.result) {
              setCourses(result.result);
            } else {
              setCourses([]);
            }
          })
          .catch((err) => {
            console.error("Search failed:", err);
            setCourses([]);
          });
      }
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  if (loading)
    return (
      <p className="text-center mt-4">
        <i className="fas fa-spinner fa-spin"></i> Loading courses...
      </p>
    );

  if (error)
    return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg course-card">
        {/* Title */}
        <div className="table-title">
          <h4 className="mb-0">
            <i className="fas fa-list me-2"></i> Courses List
          </h4>
          <button className="btn btn-refresh" onClick={fetchCourses}>
            <i className="fas fa-sync-alt me-1"></i> Refresh
          </button>
        </div>

        {/* 🔍 Live Search */}
        <div className="d-flex mb-3 px-3">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by course name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="card-body">
          {courses.length === 0 ? (
            <p className="text-muted text-center">No courses available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-custom">
                <thead>
                  <tr>
                    <th scope="col">Sr.No</th>
                    <th scope="col">Course Name</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr key={course.course_id}>
                      <td>{index + 1}</td>
                      <td className="fw-bold">{course.course_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
