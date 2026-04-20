import React, { useState } from "react";
import axios from "axios";

export default function SearchByExam() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/question/byexam/details/${title}/${date}`
      );
      setResults(res.data);
    } catch (err) {
      setResults([]);
      alert(err.response?.data?.message || "Error fetching data");
    }
  };

  return (
    <div>
      <h3>Search Questions by Exam</h3>
      <input
        type="text"
        placeholder="Exam Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-control my-2"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
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
