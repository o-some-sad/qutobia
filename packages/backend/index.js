import process from 'node:process';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import appRouter from './routes/index.js';

dotenv.config();
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Mongoose connection successfully established');
  } catch (err) {
    console.error(`Mongoose connection error:${err}`);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.end(`<div style="text-align: center;"><h1>Welcome to Kotobia WebSite</h1></div>`);
});

app.get("/api/hello", (req, res) => {
  res.json({
    ok: true
  });
});

app.use(express.json());
app.use('/api', appRouter);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  });
});

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
