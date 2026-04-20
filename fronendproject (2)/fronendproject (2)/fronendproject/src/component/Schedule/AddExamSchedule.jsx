import React, { useState } from "react";
import axios from "axios";

export default function AddSchedule() {
  const [scheduleData, setScheduleData] = useState({
    exam_id: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    setScheduleData({ ...scheduleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated. Please log in.");
      return;
    }

    try {
      const payload = {
        exam_id: Number(scheduleData.exam_id),
        start_time: scheduleData.start_time,
        end_time: scheduleData.end_time,
      };

      await axios.post("http://localhost:5000/api/schedule/addschedule", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Schedule added successfully!");

      setScheduleData({
        exam_id: "",
        start_time: "",
        end_time: "",
      });
    } catch (err) {
      // console.error(err);
      alert("❌ Failed to add schedule: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center mb-4">Add Exam Schedule</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exam_id" className="form-label">Exam ID</label>
            <input
              type="number"
              className="form-control"
              id="exam_id"
              name="exam_id"
              value={scheduleData.exam_id}
              onChange={handleChange}
              required
              placeholder="Enter Exam ID"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="start_time" className="form-label">Start Time</label>
            <input
              type="datetime-local"
              className="form-control"
              id="start_time"
              name="start_time"
              value={scheduleData.start_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="end_time" className="form-label">End Time</label>
            <input
              type="datetime-local"
              className="form-control"
              id="end_time"
              name="end_time"
              value={scheduleData.end_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary px-4">
          <i className="fas fa-plus me-2"></i> Add Schedule
          </button>
          </div>

        </form>
      </div>
    </div>
  );
}
