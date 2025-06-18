import { AuthManager } from "../../services/AuthManager.js";

function logout() {
  if (confirm("Do you really want to logout?")) {
    window.location.href = "/login";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("Admin dashboard loaded.");
  // Check if we're on the dashboard page
  if (window.location.pathname === "/dashboard") {
    // Import AuthManager and check admin access
    if (typeof AuthManager !== "undefined") {
      AuthManager.requireAdminAccess();
    } else {
      // Fallback check if AuthManager is not available
      const token = localStorage.getItem("JWTtoken");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Check if token is expired
        if (payload.exp < Date.now() / 1000) {
          localStorage.removeItem("JWTtoken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }

        // Check if user has admin role
        const roles = payload.role;
        if (!Array.isArray(roles) || !roles.includes("ROLE_ADMIN")) {
          alert("Access denied. Admin privileges required.");
          window.location.href = "/";
          return;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("JWTtoken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  }
});
