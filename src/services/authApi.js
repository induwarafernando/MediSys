// src/services/authApi.js
export const authApi = {
  async login(email, password, rememberMe) {
    // simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // simple fake check
    if (email === "clinic@test.com" && password === "password123") {
      return {
        idToken: "FAKE_ID_TOKEN_123",
        accessToken: "FAKE_ACCESS_TOKEN",
        refreshToken: rememberMe ? "FAKE_REFRESH_TOKEN" : "",
        role: "clinic_user",
      };
    }

    if (email === "staff@test.com" && password === "password123") {
      return {
        idToken: "FAKE_ID_TOKEN_456",
        accessToken: "FAKE_ACCESS_TOKEN",
        refreshToken: rememberMe ? "FAKE_REFRESH_TOKEN" : "",
        role: "internal_staff",
      };
    }

    // fallback: invalid credentials
    throw new Error("Invalid email or password");
  },

  logout() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
  },
};
