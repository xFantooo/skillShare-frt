import express from "express";

const router = express.Router();

const globals = {
  API_URL: process.env.API_URL || "http://localhost:8000",
};

router.get("/", (req, res) => {
  res.render("layout", { title: "Home", view: "pages/home" });
});

router.get("/register", (req, res) => {
  res.render("layout", {
    title: "Register",
    view: "pages/register",
    ...globals,
  });
});

router.get("/login", (req, res) => {
  res.render("layout", { title: "Login", view: "pages/login", ...globals });
});

router.get("/skills", (req, res) => {
  res.render("layout", { title: "Skills", view: "pages/skills", ...globals });
});

router.get("/profil", (req, res) => {
  res.render("layout", { title: "Profil", view: "pages/profil", ...globals });
});

router.get("/dashboard", (req, res) => {
  res.render("layout", {
    title: "Dashboard",
    view: "pages/dashboard",
    ...globals,
  });
});

router.get("/verify-email", (req, res) => {
  res.render("layout", {
    title: "VerifyEmail",
    view: "pages/verify-email",
    ...globals,
  });
});

export default router;
