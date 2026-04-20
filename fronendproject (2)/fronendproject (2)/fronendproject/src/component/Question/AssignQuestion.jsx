import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AssignQuestion() {
  const [examId, setExamId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/questions/viewquestions")
      .then(res => setQuestions(res.data.result))
      .catch(() => setQuestions([]));
  }, []);

  const toggleQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!examId || selectedQuestions.length === 0) {
      setMessage("Select exam and questions!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/questions/exam/assignexam", {
        exam_id: examId,
        questionsIds: selectedQuestions,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error assigning questions");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Assign Questions to Exam</h3>
      <input
        type="text"
        placeholder="Exam ID"
        value={examId}
        onChange={(e) => setExamId(e.target.value)}
        className="form-control my-2"
      />

      <div className="card mt-3">
        <div className="card-header">Select Questions</div>
        <div className="card-body" style={{ maxHeight: "300px", overflowY: "auto" }}>
          {questions.map((q) => (
            <div key={q.question_id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`q-${q.question_id}`}
                checked={selectedQuestions.includes(q.question_id)}
                onChange={() => toggleQuestion(q.question_id)}
              />
              <label htmlFor={`q-${q.question_id}`} className="form-check-label">
                {q.question_id}. {q.question_text}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary mt-3" onClick={handleAssign}>
        Assign Selected Questions
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
