import { fetchData } from "../../lib/fetchData.js";
import { validateRegisterForm } from "../../services/validate.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#register-form");
  const API_URL = document.querySelector("#api-url").value;
  const msg = document.querySelector("#verify-msg");
  const msgContainer = document.querySelector(".message-container");
  const filePreview = document.getElementById("filePreview");

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
      if (!result.success) {
        throw new Error(result.error);
      }
      if (result.success) {
        msg.textContent =
          "Registeration successful! Please check your email to verify your account.";
        msg.style.color = "green";
        registerForm.reset();
        filePreview.classList.remove("show");
      }
    } catch (error) {
      msg.textContent = error.message;
      msg.style.color = "red";
      msgContainer.style.display = "block";
    }
  });
});
