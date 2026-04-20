import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/admin/login`, { email, password });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user?.role);
      if (res.data.user?.userid) {
        localStorage.setItem("userid", res.data.user.userid);
      }
    }

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/admin/register`, userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration failed" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userid");
};
