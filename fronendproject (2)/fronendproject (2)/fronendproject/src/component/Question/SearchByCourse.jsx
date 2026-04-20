import React, { useState } from "react";
import axios from "axios";

export default function SearchByCourse() {
  const [course, setCourse] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/question/bycoursename/${course}`
      );
      setResults(res.data);
    } catch (err) {
      setResults([]);
      alert(err.response?.data?.message || "Error fetching data");
    }
  };

  return (
    <div>
      <h3>Search Questions by Course</h3>
      <input
        type="text"
        placeholder="Course Name"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        className="form-control my-2"
      />
      <button className="btn btn-primary" onClick={handleSearch}>
        Search
      </button>

      <ul className="mt-3">
        {results.map((q) => (
          <li key={q.question_id}>{q.question_text}</li>
        ))}
      </ul>
    </div>
  );
}
