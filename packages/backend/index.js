import process, { cwd } from "node:process";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import appRouter from "./routes/index.js";
import { handleErrorMiddleware } from "./middlewares/handleError.middleware.js";
import cookieParser from "cookie-parser";
import "./utilities/logger.js";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { WebSocketExpress } from "websocket-express";

const app = new WebSocketExpress();
import path from "node:path";

dotenv.config({
  path: path.join(cwd(), ".env"),
});
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

app.get('*', (req, res
) => {
  res.sendFile(path.join(public_dir, 'index.html'));
})


app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
