// Create floating particles
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 8 + "s";
    particle.style.animationDuration = Math.random() * 3 + 5 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Cursor interaction effect
document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".home");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  cursor.style.setProperty("--mouse-x", x);
  cursor.style.setProperty("--mouse-y", y);
});

// Initialize particles when page loads
window.addEventListener("load", () => {
  createParticles();
});

// Add subtle parallax effect
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector(".home");
  const speed = scrolled * 0.5;
  parallax.style.transform = `translateY(${speed}px)`;
});
