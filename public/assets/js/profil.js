import { AuthManager } from "../../services/AuthManager.js";
import { fetchData } from "../../lib/fetchData.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-btn-primary-mt-3");
  const API_URL = document.querySelector("#api-url").value;
  const infoForm = document.querySelector("#info-Form");
  const msg = document.querySelector("#verify-msg");
  const msgContainer = document.querySelector(".message-container");
  if (!AuthManager.isLoggedIn("Connection is required to acces /profil")) {
    return;
  }
  const user = AuthManager.getUser();

  if (!user) {
    AuthManager.logout();
    return;
  }
  // Gestion des infos actuel de user connecté
  document.querySelector("#username").value = user.username;
  infoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const infoData = new FormData(infoForm);

    const jsonData = {};
    infoData.forEach((value, key) => {
      jsonData[key] = value;
    });
    try {
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
});
