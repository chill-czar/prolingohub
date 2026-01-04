import axios from "axios";

// Base axios instance for general API calls
const api = axios.create({
  baseURL: "", // Uses relative URLs since we're in the same domain
  headers: {
    "Content-Type": "application/json",
  },
});

// Admin axios instance (headers set dynamically)
const adminApi = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adminApi to add auth header dynamically
adminApi.interceptors.request.use((config) => {
  // Check if user is authenticated (you can customize this logic)
  const isAuthenticated =
    typeof window !== "undefined" &&
    localStorage.getItem("admin_session") === "authenticated";

  if (isAuthenticated) {
    config.headers.Authorization =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "advpass321";
  }

  return config;
});

// Error interceptor for logging and normalizing errors
const errorInterceptor = (error) => {
  // Log error details for debugging
  console.error("API Error:", {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    message: error.message,
  });

  // Normalize error message for user display
  let userMessage = "An unexpected error occurred";

  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        userMessage = data.error || "Invalid request data";
        break;
      case 401:
        userMessage = "Authentication failed. Please check your credentials.";
        break;
      case 403:
        userMessage =
          "Access denied. You do not have permission for this action.";
        break;
      case 404:
        userMessage = "The requested resource was not found.";
        break;
      case 409:
        userMessage =
          data.error || "Conflict: This action cannot be performed.";
        break;
      case 422:
        userMessage = "Validation failed. Please check your input.";
        break;
      case 500:
        userMessage = "Server error. Please try again later.";
        break;
      default:
        userMessage = data.error || `Error ${status}: ${statusText}`;
    }
  } else if (error.request) {
    userMessage = "Network error. Please check your connection.";
  }

  // Attach normalized message to error
  error.userMessage = userMessage;

  return Promise.reject(error);
};

// Add error interceptor to both instances
api.interceptors.response.use((response) => response, errorInterceptor);

adminApi.interceptors.response.use((response) => response, errorInterceptor);

export { api, adminApi };
export default api;
