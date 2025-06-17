import express from "express";
import helmet from "helmet";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.js";
dotenv.config();
const API_URL = process.env.API_URL || "http://localhost:8000";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "localhost:*",
        ],
        connectSrc: ["'self'", "ws://localhost:*", API_URL],
        imgSrc: ["'self'", "data:", "blob:", API_URL],
        styleSrc: ["'self'", "'unsafe-inline'"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
  })
);
const __dirname = path.resolve();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);

// 404 handler - This must be after all other routes
app.use((req, res) => {
  res.status(404).render("layout", {
    title: "404 - Page Not Found",
    view: "pages/404",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
