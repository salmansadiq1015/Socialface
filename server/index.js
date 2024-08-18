import express from "express";
import cors from "cors";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import db from "./utils/db.js";
import userRoute from "./routes/userRoutes.js";
import storyRoute from "./routes/storiesRoutes.js";
import postRoute from "./routes/postRoutes.js";

// Dotenv Config
dotenv.config();

// Database Config
db();

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Rest API's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/story", storyRoute);
app.use("/api/v1/post", postRoute);
// app.use("/api/v1/marketplace", userRoute);
// app.use("/api/v1/user", userRoute);

app.use("/", (req, res) => {
  res.send("Server is running...");
});

// Linten
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`.bgMagenta.white);
});
