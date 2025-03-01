// import * as shared from "shared";
import express from "express";
import router from "./routes/index.js";
import mongoose from "mongoose";
import process from "process";
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/kotobia");
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: ", err);
  process.exit(1);
});

app.use("/uploads", express.static("uploads")); // multer

app.get("/", (req, res) => {
  res.end("hello world");
});

app.get("/api/hello", (req, res) => {
  res.json({
    ok: true
  });
});

app.use(express.json());

app.use(router);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000; // ** add .env file
app.listen(PORT, () => {
  console.log("Server running on port: 3000");
});
