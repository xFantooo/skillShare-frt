export class AuthManager {
  static isLoggedIn(message) {
    const token = localStorage.getItem("JWTtoken");
    const notAllowedPaths = ["%2Fskills", "%2Fprofil"];

    if (!token || this.isTokenExpired(token)) {
      const currentPath = encodeURIComponent(window.location.pathname);

      this.logout();
      if (notAllowedPaths.includes(currentPath)) {
        window.location.href = `/login?redirect=${currentPath}${
          message ? `&message=${encodeURIComponent(message)}` : ""
        }`;
      }
      return false;
    }
    return true;
  }

  static isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log(Date.now());
      console.log(payload.role);

      return payload.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }

  static getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  static getAdmin() {
    const token = localStorage.getItem("JWTtoken");
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const roleStr = payload.role;
      console.log("Role from token:", roleStr);

      return Array.isArray(roleStr) && roleStr.includes("ROLE_ADMIN");
    } catch (e) {
      console.error("Failed to parse role from localStorage:", e);
      return false;
    }
  }

  static requireAdminAccess() {
    if (!this.isLoggedIn()) {
      window.location.href =
        "/login?message=Access denied. Admin privileges required.";

      return false;
    }

    if (!this.getAdmin()) {
      // Show error message or redirect to unauthorized page
      alert("Access denied. Admin privileges required.");
      window.location.href = "/";
      return false;
    }

    return true;
  }

  static updateNavbar() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    const isLoggedIn = this.isLoggedIn();
    const user = this.getUser();
    const admin = this.getAdmin();

    console.log("isLoggedIn:", isLoggedIn);
    console.log("user:", user);
    console.log("admin:", admin);

    if (isLoggedIn && (user || admin)) {
      let html = `
        <li><a href="/">Accueil</a></li>
        <li><a href="/skills">Compétences</a></li>
        <li><a href="/profil">Profil</a></li>
        <li><a href="#" id="logout-btn">Logout</a></li>
      `;

      if (admin) {
        html += `<li><a href="/dashboard">Dashboard</a></li>`;
      }

      navLinks.innerHTML = html;

      const logoutBtn = document.querySelector("#logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.logout();
          window.location.href = "/login";
        });
      }
    }
  }

  static logout() {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("user");
    // window.location.href = "/";
  }
}
