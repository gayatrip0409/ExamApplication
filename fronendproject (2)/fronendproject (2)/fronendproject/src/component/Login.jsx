import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authservices"; 
import "bootstrap/dist/css/bootstrap.min.css";

function Login({ setIsLoggedIn, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);

      // Normalize role to lowercase
      const role = data.user?.role?.toLowerCase();
      console.log("user role:", role);
      

      // Save token and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("userid", data.user?.userid || "");

      // Update state in App
      setIsLoggedIn(true);
      setRole(role);

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "student") {
        navigate("/student");
      } else {
        setError("Invalid role. Contact admin.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url("https://static.vecteezy.com/system/resources/thumbnails/069/244/144/small_2x/international-relations-student-studying-us-china-trade-war-case-studies-from-textbooks-and-laptops-in-campus-library-in-stock-concept-and-empty-space-on-the-left-side-set-2-photo.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(6px)",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#fff",
        }}
      >
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="text-center mb-3">
            <button type="submit" className="btn btn-primary" style={{ width: "150px" }}>
              Login
            </button>
          </div>

          <div className="text-center mt-3">
            <Link to="/forgot" className="d-block small text-decoration-none mb-2">
              Forgot Password?
            </Link>
            <span className="small">
              Don’t have an account?{" "}
              <Link to="/register" className="text-decoration-none">
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
