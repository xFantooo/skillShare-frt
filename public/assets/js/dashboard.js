function logout() {
  if (confirm("Do you really want to logout?")) {
    window.location.href = "/logout";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin dashboard loaded.");
});
