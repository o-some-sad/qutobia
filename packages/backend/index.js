import dotenv from "dotenv";
dotenv.config();
import process from "node:process";
import express from "express";
import mongoose from "mongoose";
import appRouter from "./routes/index.js";
import { handleErrorMiddleware } from "./middlewares/handleError.middleware.js";
import redisClient from "./utilities/redisClient.js";
import cookieParser from "cookie-parser";
import "./utilities/logger.js";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { WebSocketExpress, Router } from "websocket-express";

const app = new WebSocketExpress();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongoose connection successfully established");
  } catch (err) {
    console.error(`Mongoose connection error:${err}`);
    process.exit(1);
  }
};

app.get("/", async (req, res) => {
  await redisClient.set("key", "awesome redis value");
  const value = await redisClient.get("key");
  res.end(
    `<div style="text-align: center;"><h1>Welcome to qutobia WebSite, value from redis: ${value}</h1></div>`
  );
});

app.get("/api/hello", (req, res) => {
  res.json({
    ok: true,
  });
});

if (process.env.ENVIRONMENT === "production") {
  // to enforce global rate-limit across multiple servers (assuming we decide to horizontally scale our beautiful project in the future!) +++ to save the requests count in the redis server and not in-memory.
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8",
    legacyHeaders: false, //make true if you want the rate-limiter header to be sent in the response.
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
  });

  app.use(limiter); //Apply the rate limiting middleware to all requests.
}
app.use(express.json());
app.use(cookieParser());
app.use("/api", appRouter);
app.use(handleErrorMiddleware);

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
