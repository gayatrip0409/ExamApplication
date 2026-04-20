import React, { useState } from "react";
import axios from "axios";

export default function ViewAssignedQuestions() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!title || !date) {
      alert("Please enter both exam title and date");
      return;
    }
    try {
      setLoading(true);
      setQuestions([]);

      // format date as YYYY-MM-DD
      const formattedDate = new Date(date).toISOString().split("T")[0];

      const res = await axios.get(
        "http://localhost:5000/api/question/byexam/details",
        {
          params: { title, start_time: formattedDate },
        }
      );

      setQuestions(res.data);
    } catch (err) {
      setQuestions([]);
      alert(err.response?.data?.message || "Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">View Questions Assigned to Exam</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Exam Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control my-2"
          />
        </div>
        <div className="col-md-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control my-2"
          />
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <button
            className="btn btn-primary px-4"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="text-info">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-muted">No questions found</p>
        ) : (
          <table className="table table-bordered table-hover">
            <thead className="bg-secondary text-white">
              <tr>
                <th>ID</th>
                <th>Question</th>
                <th>Option A</th>
                <th>Option B</th>
                <th>Option C</th>
                <th>Option D</th>
                <th>Correct</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.question_id}>
                  <td>{q.question_id}</td>
                  <td>{q.question_text}</td>
                  <td>{q.option_a}</td>
                  <td>{q.option_b}</td>
                  <td>{q.option_c}</td>
                  <td>{q.option_d}</td>
                  <td>
                    <span className="badge bg-success">
                      {q.correct_option?.toUpperCase()}
                    </span>
                  </td>
                  <td>{q.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
