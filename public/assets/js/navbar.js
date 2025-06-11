document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  const toggleMenu = () => {
    toggle.classList.toggle("active");
    navLinks.classList.toggle("open");
  };

  toggle.addEventListener("click", toggleMenu);

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });
});
