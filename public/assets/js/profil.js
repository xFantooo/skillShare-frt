import { AuthManager } from "../../services/AuthManager.js";
import { fetchData } from "../../lib/fetchData.js";
import { validateRegisterForm } from "../../services/validate.js";
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-btn-primary-mt-3");
  const API_URL = document.querySelector("#api-url").value;
  const infoForm = document.querySelector("#info-Form");
  const msg = document.querySelector("#verify-msg");
  const msgContainer = document.querySelector(".message-container");
  const submitInfoButton = infoForm.querySelector("button");
  submitInfoButton.setAttribute("disabled", true);

  if (!AuthManager.isLoggedIn("Connection is required to acces /profil")) {
    return;
  }
  const user = AuthManager.getUser();

  if (!user) {
    AuthManager.logout();
    return;
  }

  const usernameInput = document.querySelector("#username");
  const emailInput = document.querySelector("#email");
  // Gestion des infos actuelles du user connecté
  usernameInput.value = user.username;
  emailInput.value = user.email;

  usernameInput.addEventListener("change", () => {
    submitInfoButton.removeAttribute("disabled");
  });

  emailInput.addEventListener("change", () => {
    submitInfoButton.removeAttribute("disabled");
  });
  infoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    infoForm
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));

    infoForm
      .querySelectorAll("input")
      .forEach((input) => input.classList.remove("error-input"));
    // validation données
    const { valid, errors } = validateRegisterForm(infoForm);

    if (!valid) {
      // affichage des erreurs
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = infoForm.querySelector(`[data-error="${field}"]`);
        if (errorSpan) {
          errorSpan.textContent = message;
        }
        const input = infoForm.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add("error-input");
        }
      }
      return;
    }
    const infoData = new FormData(infoForm);
    console.log("infoData", infoData);

    const jsonData = {};
    infoData.forEach((value, key) => {
      jsonData[key] = value;
    });
    try {
      // const token = localStorage.getItem("JWTtoken");
      const result = await fetchData({
        route: "/api/user/update",
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
        // mise a jour User en local
        const updatedUser = {
          ...user,
          ...jsonData,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        msg.textContent = result.message;
        msg.style.color = "green";
        msgContainer.style.display = "block";
      }
    } catch (error) {
      msg.textContent = error.message;
      msg.style.color = "red";
      msgContainer.style.display = "block";
    }
  });
  // Gérer l'avatar
  const avatarImg = document.getElementById("user-avatar");
  const avatarPreview = document.getElementById("avatar-preview");
  const avatarPreviewContainer = document.getElementById(
    "avatar-preview-container"
  );
  const avatarFileInfo = document.getElementById("avatar-file-info");

  avatarImg.src = `${API_URL}/uploads/avatar/${user.avatar}`;

  // Gérer le formulaire d'avatar
  const avatarForm = document.getElementById("avatar-form");
  const avatarInput = document.getElementById("avatar-input");
  const avatarMsg = document.getElementById("avatar-msg");

  // Ajouter l'écouteur pour le preview de l'image
  avatarInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
      // Vérifier si c'est bien une image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Afficher le preview
          avatarPreview.src = e.target.result;
          avatarPreviewContainer.style.display = "block";

          // Mettre à jour les infos du fichier
          const fileSize = (file.size / 1024).toFixed(1) + " KB";
          avatarFileInfo.textContent = `Preview: ${file.name} (${fileSize})`;
        };
        reader.readAsDataURL(file);

        // Effacer les messages d'erreur précédents
        avatarMsg.textContent = "";
        avatarMsg.className = "message";
      } else {
        avatarMsg.textContent = "Please select a valid image file";
        avatarMsg.className = "message error";

        // Cacher le preview si ce n'est pas une image
        avatarPreviewContainer.style.display = "none";
      }
    } else {
      // Cacher le preview si aucun fichier n'est sélectionné
      avatarPreviewContainer.style.display = "none";
    }
  });

  avatarForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Préparer le fichier pour l'upload
    const formData = new FormData();
    const file = avatarInput.files[0];
    if (!file) {
      avatarMsg.textContent = "Please select a file";
      avatarMsg.className = "message error";
      return;
    }

    // Vérifier le type de fichier avant l'upload
    if (!file.type.startsWith("image/")) {
      avatarMsg.textContent = "Please select a valid image file";
      avatarMsg.className = "message error";
      return;
    }

    formData.append("avatar", file);

    try {
      avatarMsg.textContent = "Uploading...";
      avatarMsg.className = "message info";

      const result = await fetchData({
        route: "/api/user/update-avatar",
        api: API_URL,
        options: {
          method: "POST",
          body: formData,
        },
      });

      if (result.success) {
        // Mettre à jour l'avatar dans le localStorage
        const updatedUser = { ...user, avatar: result.avatar };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Mettre à jour l'image avec le nouvel avatar du serveur
        avatarImg.src = `${API_URL}/uploads/avatar/${result.avatar}`;

        // Cacher le preview après upload réussi
        avatarPreviewContainer.style.display = "none";

        // Message de succès
        avatarMsg.textContent = "Avatar updated successfully!";
        avatarMsg.className = "message success";

        // Reset du formulaire
        avatarForm.reset();
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error while updating the avatar:", error);
      avatarMsg.textContent = `Error: ${error.message}`;
      avatarMsg.className = "message error";

      // Restaurer l'image originale en cas d'erreur
      avatarImg.src = `${API_URL}/uploads/avatar/${user.avatar}`;

      // Cacher le preview en cas d'erreur
      avatarPreviewContainer.style.display = "none";
    }
  });
});
