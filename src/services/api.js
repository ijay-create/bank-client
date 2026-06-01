import axios from "axios";

/* =========================
   BASE API
========================= */
const API = axios.create({
  baseURL: "https://bank-server-blcj.onrender.com",
  withCredentials: true,
});

/* =========================
   REQUEST INTERCEPTOR (FIXED - SINGLE VERSION)
========================= */
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("bank_user");

  if (stored) {
    try {
      const user = JSON.parse(stored);
      const token = user?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("Invalid stored user");
    }
  }

  return config;
});

/* =========================
   RESPONSE INTERCEPTOR (REFRESH FIXED)
========================= */
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const stored = localStorage.getItem("bank_user");
        if (!stored) throw new Error("No auth data");

        const user = JSON.parse(stored);

        if (!user?.refreshToken) {
          throw new Error("No refresh token");
        }

        // FIXED: use production URL (NOT localhost)
        const response = await axios.post(
          "https://bank-server-blcj.onrender.com/api/auth/refresh-token",
          {
            refreshToken: user.refreshToken,
          }
        );

        const newAccessToken = response.data.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token returned");
        }

        const updatedUser = {
          ...user,
          accessToken: newAccessToken,
        };

        localStorage.setItem(
          "bank_user",
          JSON.stringify(updatedUser)
        );

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (err) {
        console.log("Refresh token failed:", err.message);

        localStorage.removeItem("bank_user");
        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;