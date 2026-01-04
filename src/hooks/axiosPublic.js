import axios from "axios";

// Create a single instance to reuse (performance optimization)
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const axiosPublicInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Interceptor for error handling
axiosPublicInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const useAxiosPublic = () => {
  return axiosPublicInstance;
};

export default useAxiosPublic;
