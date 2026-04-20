import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const StartExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const studentId = localStorage.getItem("userid");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const timerRef = useRef(null);

  // Fetch exam questions + duration
  useEffect(() => {
      console.log("Exam ID:", examId); 
    axios
      .get(`http://localhost:5000/api/exam/${examId}/questions`)
      .then((res) => {
        setQuestions(res.data.questions || []);

        // Duration from API or fallback
        const examDuration =
          res.data.duration || location.state?.duration || null;

        if (examDuration) setTimeLeft(examDuration * 60); // minutes → seconds
        setError("");
      })
      .catch(() => {
        setError("❌ Failed to load exam questions.");
      })
      .finally(() => setLoading(false));
  }, [examId, location.state]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true); // auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  // Handle answer change
  const handleOptionChange = (questionId, selectedOption) => {
    if (submitted || isSubmitting) return;
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  // Submit answers
  const handleSubmit = (auto = false) => {
    if (!studentId || !examId) {
      alert("Invalid student or exam info.");
      return;
    }

    if (submitted || isSubmitting) return;

    setIsSubmitting(true);

    const formattedAnswers = Object.entries(answers).map(
      ([question_id, selected_option]) => ({
        question_id,
        selected_option,
      })
    );

    // Auto-submit even if not all answered
    if (!auto && formattedAnswers.length !== questions.length) {
      alert("Please answer all questions before submitting.");
      setIsSubmitting(false);
      return;
    }

    axios
      .post(
        `http://localhost:5000/api/student/${studentId}/exam/${examId}/submit`,
        { answers: formattedAnswers }
      )
      .then((res) => {
        clearInterval(timerRef.current);
        setSubmitted(true);
        setResult(res.data);

        if (auto) {
          // redirect after 1.5s
          setTimeout(() => navigate("/student/exams"), 1500);
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.error ||
          "Something went wrong while submitting.";
        alert("❌ " + msg);
        setIsSubmitting(false);
      });
  };

  // Pagination logic
  const indexOfLastQ = currentPage * questionsPerPage;
  const indexOfFirstQ = indexOfLastQ - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQ, indexOfLastQ);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // Format time mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) return <p className="text-center mt-4">Loading questions...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!questions.length)
    return <div className="alert alert-warning">No questions found.</div>;

  if (submitted && result) {
    return (
      <div className="container mt-5">
        <div className="alert alert-success text-center">
          <h4>✅ Exam Submitted Successfully!</h4>
          <p>
            <strong>Score:</strong> {result.score} / {result.total}
          </p>
          <p>
            <strong>Percentage:</strong> {((result.score / result.total) * 100).toFixed(2)}%
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/student/exams")}
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Timer */}
      {timeLeft !== null && !submitted && (
        <div className="alert alert-info text-center">
          ⏳ Time Left: <strong>{formatTime(timeLeft)}</strong>
        </div>
      )}

      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h4>📝 Exam</h4>
        </div>
        <div className="card-body">
          {currentQuestions.map((q, index) => (
            <div className="mb-4" key={q.question_id}>
              <h5>
                {indexOfFirstQ + index + 1}. {q.question_text}
              </h5>
              {["A", "B", "C", "D"].map((opt) => (
                <div className="form-check" key={opt}>
                  <input
                    type="radio"
                    name={`question-${q.question_id}`}
                    value={opt}
                    className="form-check-input"
                    onChange={() => handleOptionChange(q.question_id, opt)}
                    checked={answers[q.question_id] === opt}
                    disabled={isSubmitting || submitted}
                  />
                  <label className="form-check-label">
                    {q[`option_${opt.toLowerCase()}`]}
                  </label>
                </div>
              ))}
            </div>
          ))}

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>

          {/* Submit button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-success"
              onClick={() => handleSubmit()}
              disabled={isSubmitting || submitted}
            >
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartExamPage;
