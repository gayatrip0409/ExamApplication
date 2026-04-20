import React, { useEffect, useState } from "react";
import axios from "axios";


export default function ViewResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/student/1/exam/1/viewsubmitexam")
      .then((res) => {
        console.log("API Response:", res.data);
        setResults(res.data.result);
      })
      .catch((err) => {
        console.error("Error fetching submitted exam results:", err);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center exam-title">Submitted Exam Results</h2>
      <table className="table custom-table">
        <thead>
          <tr>
            <th>Result ID</th>
            <th>Title</th>
            <th>Score</th>
            <th>Total Marks</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((res, index) => (
              <tr key={res.result_id}>
                <td>{res.result_id}</td>
                <td>{res.title}</td>
                <td>{res.score}</td>
                <td>{res.total_marks}</td>
                <td>{new Date(res.start_time).toLocaleString()}</td>
                <td>{new Date(res.end_time).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No exam results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
