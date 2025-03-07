import process from "node:process";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import appRouter from "./routes/index.js";
import cors from "cors";
import { handleErrorMiddleware } from "./middlewares/handleError.middleware.js";
import { corsOptions } from "./utilities/corsOptions.js";
import redis from "redis";
// import cookieParser from "cookie-parser";

dotenv.config();
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

const redisClient = redis.createClient();
redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis successfully");

  await redisClient.set("redis key", "redis value");
  const value = await redisClient.get("key");
})();

app.use(cors(corsOptions));

app.use((req, res, next) => {
  //dummy logger for testing
  console.log(`${req.method} ..  ${req.url}`);
  next();
});

app.get("/", async (req, res) => {
  const value = await redisClient.get("redis key");
  res.end(
    `<div style="text-align: center;"><h1>Welcome to Kotobia WebSite, value from redis: ${value}</h1></div>`
  );
});

app.get("/api/hello", (req, res) => {
  res.json({
    ok: true,
  });
});
app.use(express.json());
app.use("/api", appRouter);
app.use(handleErrorMiddleware);

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
