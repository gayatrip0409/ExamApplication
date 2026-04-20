import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ViewSingleSchedule() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/schedule/${id}`)
      .then((res) => setSchedule(res.data))
      .catch((err) => console.error("Error fetching schedule", err));
  }, [id]);

  if (!schedule) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h3>Schedule Details</h3>
      <ul className="list-group">
        <li className="list-group-item">Schedule ID: {schedule.schedule_id}</li>
        <li className="list-group-item">Exam ID: {schedule.exam_id}</li>
        <li className="list-group-item">
          Start Time: {new Date(schedule.start_time).toLocaleString()}
        </li>
        <li className="list-group-item">
          End Time: {new Date(schedule.end_time).toLocaleString()}
        </li>
      </ul>
    </div>
  );
}
