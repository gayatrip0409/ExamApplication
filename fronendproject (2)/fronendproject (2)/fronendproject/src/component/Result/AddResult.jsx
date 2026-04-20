import React, { useState } from "react";
import axios from "axios";

export default function AddResult() {
  const [formData, setFormData] = useState({
    userid: "",
    exam_id: "",
    score: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated.");
        return;
      }

      const payload = {
        ...formData,
        userid: Number(formData.userid),
        exam_id: Number(formData.exam_id),
        score: Number(formData.score),
      };

      await axios.post("http://localhost:5000/api/addresult", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Result added successfully!");
      setFormData({ userid: "", exam_id: "", score: "" });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add result.");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center mb-4">Add Result</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userid" className="form-label">User ID</label>
            <input
              type="number"
              name="userid"
              id="userid"
              className="form-control"
              placeholder="Enter User ID"
              value={formData.userid}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exam_id" className="form-label">Exam ID</label>
            <input
              type="number"
              name="exam_id"
              id="exam_id"
              className="form-control"
              placeholder="Enter Exam ID"
              value={formData.exam_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="score" className="form-label">Score</label>
            <input
              type="number"
              name="score"
              id="score"
              className="form-control"
              placeholder="Enter Score"
              value={formData.score}
              onChange={handleChange}
              required
            />
          </div>

           <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="btn btn-primary px-4">
          <i className="fas fa-plus me-2"></i> Add Result
          </button>
          </div>

        </form>
      </div>
    </div>
  );
}
