import { fetchData } from "../../lib/fetchData.js";
import { validateRegisterForm } from "../../services/validate.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#register-form");
  const API_URL = document.querySelector("#api-url").value;
  console.log(API_URL);

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // réinitialisation des champs erreurs a vide
    registerForm
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));

    registerForm
      .querySelectorAll("input")
      .forEach((input) => input.classList.remove("error-input"));
    // validation données
    const { valid, errors } = validateRegisterForm(registerForm);

    if (!valid) {
      // affichage des erreurs
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = registerForm.querySelector(`[data-error="${field}"]`);
        if (errorSpan) {
          errorSpan.textContent = message;
        }
        const input = registerForm.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add("error-input");
        }
      }
      return;
    }
    // si les données sont valides, on envoie le formulaire
    const formData = new FormData(registerForm);

    const jsonData = {};
    formData.forEach((value, key) => {
      if (key !== "avatar") {
        jsonData[key] = value;
      }
    });

    // si l'avatar est présent, crée un formData
    const avatarFile = formData.get("avatar");
    if (avatarFile && avatarFile.size > 0) {
      const avatarFileData = new FormData();
      avatarFileData.append("avatar", avatarFile);
      try {
        const result = await fetchData({
          route: "/api/upload-avatar",
          api: API_URL,
          options: {
            method: "POST",
            body: avatarFileData,
          },
        });
        jsonData.avatar = result.filename;
      } catch (error) {}
    }

    try {
      const result = await fetchData({
        route: "/api/register",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify(jsonData),
        },
      });
    } catch (error) {
      //TODO message d'erreur
    }
  });
});
