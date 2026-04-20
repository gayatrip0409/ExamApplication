// src/services/examService.js
import axios from "axios";


const ExamService = {
  // ✅ Add a new exam (POST /api/addexam)
  addExam: (examData, token) =>
    axios.post("http://localhost:5000/api/addexam", examData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // ✅ Get all exams (GET /api/exams/getallexams)
  getAllExams: () =>
    axios.get("http://localhost:5000/api/exams/getallexams"),

  // ✅ Get exam by ID (GET /api/exam/:exam_id)
  getExamById: (exam_id, token) =>
    axios.get(`http://localhost:5000/api/exam/${exam_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // ✅ Update exam (PUT /api/exam/update)
  updateExam: (updatedData, token) =>
    axios.put("http://localhost:5000/api/exam/update", updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // ✅ Delete exam by ID (DELETE /api/delete/exam/:exam_id)
  deleteExamById: (exam_id, token) =>
    axios.delete(`http://localhost:5000/api/delete/exam/${exam_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // ✅ Search exam by created date (GET /api/exam/search/:created_at)
  searchExamByDate: (created_at) =>
    axios.get(`http://localhost:5000/api/exam/search/${created_at}`),

   searchExamByName: (name) =>
    axios.get(`http://localhost:5000/api/exams/searchbyname?name=${encodeURIComponent(name)}`),

  // ✅ Assign schedule to exam (POST /api/exam/:exam_id/schedule)
  assignSchedule: (exam_id, scheduleData, token) =>
    axios.post(
      `http://localhost:5000/api/exam/${exam_id}/schedule`,
      scheduleData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
};

export default ExamService;
