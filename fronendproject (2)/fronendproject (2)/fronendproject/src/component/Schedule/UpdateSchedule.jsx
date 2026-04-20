import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    exam_id: "",
    start_time: "",
    end_time: "",
  });

  const [loading, setLoading] = useState(false);

  // Convert backend datetime string to input[type=datetime-local] format (yyyy-MM-ddTHH:mm)
  const toInputFormat = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    // get local timezone offset in ms
    const offsetMs = date.getTimezoneOffset() * 60000;
    // create a new date adjusted to local timezone
    const localDate = new Date(date.getTime() - offsetMs);
    return localDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  };

  // Convert input[type=datetime-local] string back to MySQL datetime string (YYYY-MM-DD HH:mm:ss)
  const toMySQLDateTime = (datetimeLocal) => {
    if (!datetimeLocal) return null;
    // input is yyyy-MM-ddTHH:mm — just replace T with space and add seconds
    return datetimeLocal.replace("T", " ") + ":00";
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/schedule/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const { exam_id, start_time, end_time } = res.data;

        setFormData({
          exam_id,
          start_time: toInputFormat(start_time),
          end_time: toInputFormat(end_time),
        });
      } catch (error) {
        console.error("Error fetching schedule:", error);
        alert("Failed to load schedule data");
      }
    };

    fetchSchedule();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      schedule_id: id,
      exam_id: Number(formData.exam_id),
      start_time: toMySQLDateTime(formData.start_time),
      end_time: toMySQLDateTime(formData.end_time),
    };

    try {
      await axios.put("http://localhost:5000/api/schedule/update", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/admin/view-schedule", {
        state: { successMessage: "✅ Schedule updated successfully!" },
      });
    } catch (err) {
      console.error("❌ Error updating schedule:", err);
      alert("Failed to update schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h3 className="card-title text-primary mb-4">
            <i className="bi bi-pencil-square me-2"></i>Update Schedule
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Exam ID</label>
              <input
                type="text"
                name="exam_id"
                value={formData.exam_id}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Start Time</label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">End Time</label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/view-schedule")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSchedule;
