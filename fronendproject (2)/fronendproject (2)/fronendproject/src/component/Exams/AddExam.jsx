import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";

export default function AddExam() {
  const [examData, setExamData] = useState({
    title: "",
    total_marks: "",
    duration: "",
    course_id: "",
    start_time: "",
    end_time: "",
  });

  const [courses, setCourses] = useState([]); // ✅ store courses from backend

  // ✅ Fetch courses for dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/course/viewcourse");
        if (Array.isArray(res.data.result)) {
          setCourses(res.data.result);
        } else {
          console.error("Unexpected response:", res.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, []);

  // ✅ Helper function to format datetime for backend
  const formatDateTime = (value) => {
    if (!value) return "";
    return value.replace("T", " ") + ":00";  
  };

  // ✅ Helper function for min datetime (prevents past dates)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // adjust timezone
    return now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  };

  const handleChange = (e) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userid = localStorage.getItem("userid");
      const token = localStorage.getItem("token");

      if (!userid || !token) {
        alert("User not authenticated!");
        return;
      }

      // ✅ Frontend validations
      const start = new Date(examData.start_time);
      const end = new Date(examData.end_time);
      const now = new Date();

      if (start < now) {
        alert("⚠️ Exam start time cannot be in the past.");
        return;
      }
      if (end <= start) {
        alert("⚠️ Exam end time must be after start time.");
        return;
      }

      // ✅ Correct payload formatting
      const payload = {
        title: examData.title,
        total_marks: Number(examData.total_marks),
        duration: Number(examData.duration),
        course_id: Number(examData.course_id),
        start_time: formatDateTime(examData.start_time),
        end_time: formatDateTime(examData.end_time),
      };

      await axios.post("http://localhost:5000/api/addexam", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Exam added successfully!");

      // reset form
      setExamData({
        title: "",
        total_marks: "",
        duration: "",
        course_id: "",
        start_time: "",
        end_time: "",
      });
    } catch (err) {
      console.error("❌ Error while adding exam:", err.response?.data || err);
      alert("❌ Failed to add exam");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="card shadow p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-4 flex items-center justify-center gap-2 text-lg">
          <FaPlusCircle className="text-blue-600 text-base" />
           Add Exam
          </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Exam Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Enter exam title"
              value={examData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="total_marks" className="form-label">
              Total Marks
            </label>
            <input
              type="number"
              id="total_marks"
              name="total_marks"
              className="form-control"
              placeholder="Enter total marks"
              value={examData.total_marks}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="duration" className="form-label">
              Duration (in minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              className="form-control"
              placeholder="Enter duration"
              value={examData.duration}
              onChange={handleChange}
              required
            />
          </div>

          {/* ✅ Course dropdown */}
          <div className="mb-4">
            <label htmlFor="course_id" className="form-label">Select Course</label>
            <select
              id="course_id"
              name="course_id"
              className="form-select"
              value={examData.course_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="start_time" className="form-label">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              className="form-control"
              value={examData.start_time}
              onChange={handleChange}
              required
              min={getMinDateTime()} // ✅ can't pick past dates
            />
          </div>

          <div className="mb-4">
            <label htmlFor="end_time" className="form-label">
              End Time
            </label>
            <input
              type="datetime-local"
              id="end_time"
              name="end_time"
              className="form-control"
              value={examData.end_time}
              onChange={handleChange}
              required
              min={examData.start_time || getMinDateTime()} // ✅ must be after start
            />
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary px-4">
              <i className="fas fa-plus me-2"></i> Add Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
