import express from "express";
import dotenv from "dotenv";
import AuthRoutes from "./routes/Auth.js";
import Dbcon from "./utils/db.js";
import NotesRoutes from "./routes/Notes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
Dbcon();

// Enable CORS with credentials
app.use(
  cors({
    origin:  "http://localhost:5173", // change this to your frontend URL
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("hello jii ");
});

app.use("/auth", AuthRoutes);
app.use("/notes", NotesRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

