import axios from "axios";

// ✅ Add Course
export const addCourse = async (courseData, token) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/addcourse",
      courseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// ✅ Get All Courses
export const getAllCourses = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/course/viewcourse");
    return res.data.result;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// ✅ Get Course by ID
export const getCourseById = async (course_id) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/course/searchcoursebyid/${course_id}`
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// ✅ Update Course by ID
export const updateCourseById = async (course_id, courseData, token) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/course/updatecoursebyid/${course_id}`,
      courseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// ✅ Delete Course by ID
export const deleteCourseById = async (course_id, token) => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/api/course/deletecoursebyid/${course_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// ✅ Search Course by Name
export const searchCourseByName = async (course_name) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/course/search/${course_name}`
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
