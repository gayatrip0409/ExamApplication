import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExamService from "../../services/examservice";

const UpdateExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    exam_id: id,
    title: "",
    total_marks: "",
    duration: "",
    userid: "",
    created_at: "",
    course_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exam data by ID on mount
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await ExamService.getExamById(id, token);

        console.log("API response for exam data:", response.data);

        // Adjust here based on your actual API response structure:
        // If your API returns data directly, use response.data
        // If it wraps data in 'result', use response.data.result

        const exam = response.data.result || response.data;

        if (!exam) {
          throw new Error("Exam data not found");
        }

        // Format created_at to "YYYY-MM-DDTHH:mm" for datetime-local input
        const formattedDate = exam.created_at
          ? new Date(exam.created_at).toISOString().slice(0, 16)
          : "";

        setFormData({
          exam_id: exam.exam_id || id,
          title: exam.title || "",
          total_marks: exam.total_marks || "",
          duration: exam.duration || "",
          userid: exam.userid || "",
          created_at: formattedDate,
          course_id: exam.course_id || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch exam:", err);
        setError("Failed to load exam data.");
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // Prepare data to send
      const updatedData = {
        exam_id: formData.exam_id,
        title: formData.title,
        total_marks: Number(formData.total_marks),
        duration: Number(formData.duration),
        userid: Number(formData.userid),
        created_at: formData.created_at,
        course_id: Number(formData.course_id),
      };

      await ExamService.updateExam(updatedData, token);

      alert("Exam updated successfully!");
      navigate("/admin/view-exams");
    } catch (err) {
      alert("Failed to update exam. Please try again.");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading exam data...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4 w-100" style={{ maxWidth: "700px" }}>
        <h3 className="text-center mb-4">Update Exam</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Exam Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Total Marks</label>
              <input
                type="number"
                className="form-control"
                name="total_marks"
                value={formData.total_marks}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Duration (hours)</label>
              <input
                type="number"
                className="form-control"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">User ID</label>
              <input
                type="number"
                className="form-control"
                name="userid"
                value={formData.userid}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Created At</label>
              <input
                type="datetime-local"
                className="form-control"
                name="created_at"
                value={formData.created_at}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Course ID</label>
              <input
                type="number"
                className="form-control"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary px-5">
            Update Exam
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateExam;
