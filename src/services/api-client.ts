import axios from "axios";
import { env } from "@/config/env";

/**
 * Centralized Axios instance for all API communication.
 * All requests go through this client — never call axios directly.
 */
const apiClient = axios.create({
  baseURL: env.MOCK_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

// ── Request Interceptor ──────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    const status = error.response?.status;

    console.error(`[API Error] ${status}: ${message}`);

    return Promise.reject({
      message,
      status,
      code: error.code,
    });
  }
);

export { apiClient };
