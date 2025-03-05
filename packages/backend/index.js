import process from "node:process";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import appRouter from "./routes/index.js";
import cors from "cors";
import { handleErrorMiddleware } from "./middlewares/handleError.middleware.js";

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

const whiteList = [`http://localhost:${process.env.PORT || 3000}`]; //frontend to be added
const corsOptions = {
  origin: (originWeb, callback) => {
    if (!originWeb || whiteList.includes(originWeb)) {
      callback(null, true);
    } else {
      callback(new Error("not allowed"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  //dummy logger for testing
  console.log(`${req.method} ..  ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.end(
    `<div style="text-align: center;"><h1>Welcome to Kotobia WebSite</h1></div>`
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
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
