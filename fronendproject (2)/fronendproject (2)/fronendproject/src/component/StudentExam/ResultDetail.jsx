import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function ResultDetail() {
  const { exam_id } = useParams();
  const studentId = localStorage.getItem("userid");

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalQuestions = result.length;
  const correctAnswers = result.filter(
    (q) => q.correct_option?.toUpperCase() === q.selected_option?.toUpperCase()
  ).length;
  const percentage =
    totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : 0;

  useEffect(() => {
    if (!studentId || !exam_id) {
      setError("Student ID or Exam ID missing.");
      setLoading(false);
      return;
    }

    axios
      .get(
        `http://localhost:5000/api/student/${studentId}/exam/${exam_id}/result-details`
      )
      .then((res) => {
        console.log("✅ API Response:", res.data);
        setResult(res.data.result || []);
      })
      .catch((err) => {
        console.error("❌ API Error:", err);
        setError(err.response?.data?.error || "Failed to fetch result details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studentId, exam_id]);

  // 📥 Download PDF
  const downloadPDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("📊 Exam Result Report", 14, 15);

  // Table headers
  const tableColumn = ["Q.No", "Question", "Options", "Correct", "Selected"];
  const tableRows = [];

  // Add rows
  result.forEach((q, index) => {
    const options = `A) ${q.option_a}\nB) ${q.option_b}\nC) ${q.option_c}\nD) ${q.option_d}`;
    tableRows.push([
      index + 1,
      q.question_text,
      options,
      q.correct_option?.toUpperCase(),
      q.selected_option?.toUpperCase(),
    ]);
  });

  // ✅ Use autoTable function
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 25,
    styles: { fontSize: 8, cellWidth: "wrap" },
    columnStyles: {
      1: { cellWidth: 60 }, // Question column wider
      2: { cellWidth: 50 }, // Options column
    },
  });

  // Save file
  doc.save("exam_result.pdf");
};


  if (loading) return <p>⏳ Loading result details...</p>;
  if (error) return <p style={{ color: "red" }}>⚠️ {error}</p>;
  if (!result || result.length === 0) return <p>📭 No results found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Exam Result Details</h2>

      {/* Summary */}
      <div style={{ marginBottom: "15px" }}>
        <p><b>Student ID:</b> {studentId}</p>
        <p><b>Exam ID:</b> {exam_id}</p>
        <p><b>Score:</b> {correctAnswers}/{totalQuestions}</p>
        <p><b>Percentage:</b> {percentage}%</p>
      </div>

      {/* Download Button */}
      <button
        type="button"   // ✅ ensures it doesn’t trigger form submit
        onClick={downloadPDF}
        style={{
          marginBottom: "15px",
          padding: "10px 15px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ⬇️ Download PDF
      </button>

      {/* Results Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Q.No</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Question</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Options</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Correct</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Selected</th>
          </tr>
        </thead>
        <tbody>
          {result.map((q, index) => (
            <tr key={q.question_id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {index + 1}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {q.question_text}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <div>A) {q.option_a}</div>
                <div>B) {q.option_b}</div>
                <div>C) {q.option_c}</div>
                <div>D) {q.option_d}</div>
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  fontWeight: "bold",
                }}
              >
                {q.correct_option.toUpperCase()}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  fontWeight: "bold",
                }}
              >
                {q.selected_option.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
