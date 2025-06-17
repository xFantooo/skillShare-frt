export class AuthManager {
  static isLoggedIn() {
    // return !!localStorage.getItem('JWTtoken');
    const token = localStorage.getItem("JWTtoken");
    const notAllowedPaths = ["%2Fskills"];

    if (!token || this.isTokenExpired(token)) {
      const currentPath = encodeURIComponent(window.location.pathname);
      this.logout();
      if (notAllowedPaths.includes(currentPath)) {
        window.location.href = `/login?redirect=${currentPath}`;
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

  //test //SAUVEGARDE
  static getAdmin() {
    const token = localStorage.getItem("JWTtoken");
    const roleStr = JSON.parse(atob(token.split(".")[1])).role;
    console.log(roleStr.role);

    try {
      return Array.isArray(roleStr) && roleStr.includes("ROLE_ADMIN");
    } catch (e) {
      console.error("Failed to parse role from localStorage:", e);
      return false;
    }
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
  }
}
