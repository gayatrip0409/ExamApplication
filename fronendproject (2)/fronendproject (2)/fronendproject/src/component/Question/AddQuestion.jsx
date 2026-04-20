import React, { useState } from "react";
import axios from "axios";

export default function AddQuestion() {
  const [queData, setQueData] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "",
    marks: 0,
  });

  const handleChange = (e) => {
    setQueData({ ...queData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/questions/addquestions", queData);
      alert("✅ Question Added Successfully!");
      setQueData({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "",
        marks: 0,
      });
    } catch (error) {
      console.error("❌ Error adding question:", error);
      alert("Failed to add question.");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "90vh" }}>
      <div className="card shadow p-4 w-100" style={{ maxWidth: "700px" }}>
        <h3 className="text-center mb-4">Add Question</h3>
        <form onSubmit={handleSubmit}>
          {/* Question Text */}
          <div className="mb-3">
            <label className="form-label">Question</label>
            <input
              type="text"
              name="question_text"
              className="form-control"
              placeholder="Enter question text"
              value={queData.question_text}
              onChange={handleChange}
              required
            />
          </div>

          {/* Options in 2-column grid */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Option A</label>
              <input
                type="text"
                name="option_a"
                className="form-control"
                placeholder="Option A"
                value={queData.option_a}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Option B</label>
              <input
                type="text"
                name="option_b"
                className="form-control"
                placeholder="Option B"
                value={queData.option_b}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Option C</label>
              <input
                type="text"
                name="option_c"
                className="form-control"
                placeholder="Option C"
                value={queData.option_c}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Option D</label>
              <input
                type="text"
                name="option_d"
                className="form-control"
                placeholder="Option D"
                value={queData.option_d}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Correct Option & Marks side-by-side */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Correct Option (A/B/C/D)</label>
              <input
                type="text"
                name="correct_option"
                className="form-control"
                placeholder="Correct Option"
                value={queData.correct_option}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Marks</label>
              <input
                type="number"
                name="marks"
                className="form-control"
                placeholder="Marks"
                value={queData.marks}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="btn btn-primary px-4">
          <i className="fas fa-plus me-2"></i> Add Question
          </button>
          </div>

        </form>
      </div>
    </div>
  );
}
