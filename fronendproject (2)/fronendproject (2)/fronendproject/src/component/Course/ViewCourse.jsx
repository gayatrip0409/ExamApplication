import React, { useEffect, useState } from "react";
import {
  getAllCourses,
  deleteCourseById,
  updateCourseById,
  searchCourseByName,
} from "../../services/courseservice";
import "../styles/viewcourse.css";

export default function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedCourseName, setEditedCourseName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const result = await getAllCourses();
      setCourses(result);
      setLoading(false);
      setCurrentPage(1); // reset page on fetch
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("❌ Failed to fetch courses.");
      setLoading(false);
    }
  };

  // Live search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchTerm.trim()) {
        fetchCourses();
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
            setCurrentPage(1); // reset page on search
          })
          .catch((err) => {
            console.error("Search failed:", err);
            setCourses([]);
          });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const deleteCourse = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this course?")) return;

    try {
      const token = localStorage.getItem("token");
      await deleteCourseById(id, token);
      alert("✅ Course deleted successfully!");
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete course:", err);
      alert("❌ Error deleting course.");
    }
  };

  const updateCourse = (course) => {
    setEditingCourseId(course.course_id);
    setEditedCourseName(course.course_name);
  };

  const handleUpdateCourse = async () => {
    const token = localStorage.getItem("token");

    if (!editedCourseName.trim()) {
      alert("⚠️ Course name cannot be empty.");
      return;
    }

    try {
      await updateCourseById(editingCourseId, { course_name: editedCourseName.trim() }, token);
      alert("✅ Course updated successfully!");
      setEditingCourseId(null);
      setEditedCourseName("");
      fetchCourses();
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update course.");
    }
  };

  // Pagination calculations
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  // Pagination navigation handlers
  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

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
        {/* Title and refresh */}
        <div className="table-title d-flex justify-content-between align-items-center px-3 pt-3">
          <h4 className="mb-0">
            <i className="fas fa-list me-2"></i> Courses List
          </h4>
          <button className="btn btn-refresh" onClick={fetchCourses}>
            <i className="fas fa-sync-alt me-1"></i> Refresh
          </button>
        </div>

        {/* Search input */}
        <div className="d-flex mb-3 px-3 pt-2">
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
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover table-custom">
                  <thead>
                    <tr>
                      <th scope="col">Sr.No</th>
                      <th scope="col">Course Name</th>
                      <th scope="col" className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCourses.map((course, index) => (
                      <tr key={course.course_id}>
                        <td>{indexOfFirstCourse + index + 1}</td>
                        <td className="fw-bold">
                          {editingCourseId === course.course_id ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editedCourseName}
                              onChange={(e) => setEditedCourseName(e.target.value)}
                            />
                          ) : (
                            course.course_name
                          )}
                        </td>
                        <td className="text-center">
                          {editingCourseId === course.course_id ? (
                            <>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={handleUpdateCourse}
                              >
                                <i className="bi bi-check-circle"></i> Save
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                  setEditingCourseId(null);
                                  setEditedCourseName("");
                                }}
                              >
                                <i className="bi bi-x-circle"></i> Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-sm btn-edit me-2"
                                onClick={() => updateCourse(course)}
                              >
                                <i className="bi bi-pencil-square"></i> Edit
                              </button>
                              <button
                                className="btn btn-sm btn-delete"
                                onClick={() => deleteCourse(course.course_id)}
                              >
                                <i className="bi bi-trash"></i> Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <nav className="d-flex justify-content-center mt-3">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                      Prev
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                    >
                      <button onClick={() => goToPage(index + 1)} className="page-link">
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
