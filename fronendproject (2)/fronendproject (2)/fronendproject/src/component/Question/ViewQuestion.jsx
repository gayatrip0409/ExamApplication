import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewQuestion() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/questions/viewquestions")
      .then((res) => setQuestions(res.data.result))
      .catch(() => setQuestions([]));
  }, []);

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/question/delete/${id}`);
      setQuestions(questions.filter((q) => q.question_id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting question");
    }
  };

  return (
    <div className="container mt-4">
      <h3>All Questions List</h3>
      <table className="table table-bordered table-hover mt-3">
        <thead className="bg-primary text-white">
          <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Option A</th>
            <th>Option B</th>
            <th>Option C</th>
            <th>Option D</th>
            <th>Correct</th>
            <th>Marks</th>
            <th>Actions</th>
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
              <td>{q.correct_option}</td>
              <td>{q.marks}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteQuestion(q.question_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
