import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const instance = axios.create({
  baseURL,
  withCredentials: true, // IMPORTANT: Send cookies with requests
});

// Interceptor to handle 401/403 responses (optional but good practice)
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If 401/403, you might want to logout user or show error
    // For now just rejecting
    return Promise.reject(error);
  }
);

const useAxiosSecure = () => {
  return instance;
};

export default useAxiosSecure;
