import process, { cwd } from "node:process";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import appRouter from "./routes/index.js";
import { handleErrorMiddleware } from "./middlewares/handleError.middleware.js";
import path from "node:path";

dotenv.config({
  path: path.join(cwd(), ".env"),
});
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongoose connection successfully established");
  } catch (err) {
    console.error(`Mongoose connection error:${err}`);
    process.exit(1);
  }
};

app.get("/api/hello", (req, res) => {
  res.json({
    ok: true,
  });
});

const public_dir = path.join(cwd(), "_PUBLIC_");

app.use(express.static(public_dir));

app.use(express.json());
app.use("/api", appRouter);
app.use(handleErrorMiddleware);

app.get('*', (req, res
) => {
  res.sendFile(path.join(public_dir, 'index.html'));
})


app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
