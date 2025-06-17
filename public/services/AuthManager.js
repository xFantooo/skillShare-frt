export class AuthManager {
  static isLoggedIn() {
    // return !!localStorage.getItem('JWTtoken');
    const token = localStorage.getItem("JWTtoken");
    const notAllowedPaths = ["%2Fskills"];

    if (!token) {
      const currentPath = encodeURIComponent(window.location.pathname);
      this.logout();
      if (notAllowedPaths.includes(currentPath)) {
        window.location.href = `/login?redirect=${currentPath}`;
      }
      return false;
    }
    return true;
  }

  static getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  static updateNavbar() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) {
      console.log("Ul not found .");
      return;
    }
    const isLoggedIn = this.isLoggedIn();
    const user = this.getUser();

    if (isLoggedIn && user) {
      navLinks.innerHTML = `
      <li><a href="/">Accueil</a></li>
      <li><a href="/skills">Compétences</a></li>
      <li><a href="/Profil">Profil</a></li>
      <li><a href="#" id="logout-btn">Logout</a></li>
        `;

      // Gestion déconnexion
      const logoutBtn = document.querySelector("#logout-btn");

      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
        window.location.href = "/login";
      });
    }
  }

  static logout() {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("user");
  }
}
