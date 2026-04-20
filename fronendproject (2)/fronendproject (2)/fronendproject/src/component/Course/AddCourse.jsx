import React, { useState } from "react";
import axios from "axios";

export default function AddCourse() {
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Capitalize each word
  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");

  // Format course name
  const cleanCourseName = (name) => {
    return toTitleCase(name.replace(/\s+/g, " ").trim());
  };

  // Basic validations
  const isValidCourseName = (name) => {
    if (!name || name.trim() === "") return "Course name cannot be empty.";
    if (/^\d+$/.test(name)) return "Course name cannot be only numbers.";
    if (name.length < 3) return "Course name must be at least 3 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedName = cleanCourseName(courseName);

    const validationError = isValidCourseName(cleanedName);
    if (validationError) {
      setErrorMsg(validationError);
      setSuccessMsg("");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/addcourse",
        { course_name: cleanedName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMsg(response.data.result || "Course added successfully.");
      setCourseName("");
    } catch (error) {
      console.error("Error adding course:", error);
      if (error.response?.status === 401) {
        setErrorMsg("❌ Unauthorized: Please login as admin.");
      } else if (error.response?.status === 400) {
        setErrorMsg("⚠️ Course already exists or invalid input.");
      } else {
        setErrorMsg("🚨 Server error while adding course.");
      }
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h3 className="text-center mb-4 text-primary">
          <i className="fas fa-book-open me-2"></i> Add Course
        </h3>

        {/* Success Alert */}
        {successMsg && (
          <div className="alert alert-success text-center" role="alert">
            <i className="fas fa-check-circle me-2"></i> {successMsg}
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="alert alert-danger text-center" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="courseName" className="form-label fw-bold">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              className={`form-control ${errorMsg ? "is-invalid" : ""}`}
              placeholder="Enter course name..."
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              maxLength={100}
              required
            />
            <small className="form-text text-muted">
              e.g. Java Backend, Python for Beginners
            </small>
          </div>

          <div className="text-center mt-3">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i> Adding...
                </>
              ) : (
                <>
                  <i className="fas fa-plus me-2"></i> Add Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
