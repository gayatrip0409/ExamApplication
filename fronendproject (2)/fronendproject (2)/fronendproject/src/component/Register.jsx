import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/register", formData);
      setMessage(res.data.result || "✅ Registration successful!");
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Something went wrong");
    }
  };

  return (
      <div
  className="container-fluid d-flex justify-content-center align-items-center min-vh-100"
  style={{
    backgroundImage: `url("https://static.vecteezy.com/system/resources/thumbnails/069/244/144/small_2x/international-relations-student-studying-us-china-trade-war-case-studies-from-textbooks-and-laptops-in-campus-library-in-stock-concept-and-empty-space-on-the-left-side-set-2-photo.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
  

      <div
  className="card shadow p-4"
  style={{
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // black with 50% opacity
    backdropFilter: "blur(6px)",          // optional: background blur
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.1)", // subtle border
    color: "#fff" // ensures text is readable on dark background
  }}
>
        <h2 className="text-center mb-4 text-primary">Create Account</h2>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Submit */}
        <div className="text-center">
        <button type="submit" className="btn btn-primary px-4">
        Register
        </button>
        </div>

        </form>

        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
