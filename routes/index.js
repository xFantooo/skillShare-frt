import express from "express";
const router = express.Router();

// Import routes
router.get("/", (req, res) => {
  res.render("layout", { title: "Home", view: "pages/home" });
});

export default router;
