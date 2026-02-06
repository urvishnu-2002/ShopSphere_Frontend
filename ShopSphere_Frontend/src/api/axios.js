import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// LOGIN FUNCTION
export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API_BASE_URL}/login`,
    loginData
  );
  return response.data;
};

// SIGNUP FUNCTION
export const signupUser = async (signupData) => {
    console.log(signupData);
  const response = await axios.post(
    `${API_BASE_URL}/register/`,
    signupData
  );
  return response.data;
};
