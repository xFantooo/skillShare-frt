import { fetchData } from "../../lib/fetchData.js";
import { AuthManager } from "../../services/AuthManager.js";
import { validateRegisterForm } from "../../services/validate.js";

document.addEventListener("DOMContentLoaded", () => {
  // rediriger si déja connecter
  if (AuthManager.isLoggedIn()) {
    // window.location.href = "/";
    return;
  }
  const loginForm = document.querySelector("#login-form");
  const API_URL = document.querySelector("#api-url").value;
  const msg = document.querySelector("#verify-msg");
  const msgContainer = document.querySelector(".message-container");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginForm
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));

    // etat de chargement
    loginForm
      .querySelectorAll("input")
      .forEach((input) => input.classList.remove("error-input"));
    // validation données
    const { valid, errors } = validateRegisterForm(loginForm);

    if (!valid) {
      // affichage des erreurs
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = loginForm.querySelector(`[data-error="${field}"]`);
        if (errorSpan) {
          errorSpan.textContent = message;
        }
        const input = loginForm.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add("error-input");
        }
      }
      return;
    }
    const formData = new FormData(loginForm);

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const result = await fetchData({
        route: "/api/login",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify(jsonData),
        },
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      if (result.success) {
        localStorage.setItem("JWTtoken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        msg.textContent = "Succesfully Connected";
        msg.style.color = "green";
        msgContainer.style.display = "block";
        AuthManager.updateNavbar();

        setTimeout(() => {
          const params = new URLSearchParams(window.location.search);
          const redirect = params.get("redirect") || "/";
          window.location.href = redirect;
        }, 2000);
      }
    } catch (error) {
      msg.textContent = error.message;
      msg.style.color = "red";
      msgContainer.style.display = "block";
    }
  });
});
