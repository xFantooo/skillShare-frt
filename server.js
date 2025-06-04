import express from "express";
import helmet from "helmet";
import path from "path";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet());
const __dirname = path.resolve();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
