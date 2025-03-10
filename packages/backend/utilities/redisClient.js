import redis from "redis";
import dotenv from "dotenv";
import Book from "../models/book.model.js";

dotenv.config();

const redisClient = redis.createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

await redisClient.connect();

(async () => {
  const books = await Book.find({ deletedAt: null }).exec();
  const bookCount = await Book.find({ deletedAt: null })
    .countDocuments()
    .exec();
  const totalPages = Math.ceil(bookCount / 10);
  const allBooks = { Total_Pages: totalPages, Books: books };
  redisClient.set("allBooks", JSON.stringify(allBooks));
})();

console.log("redis up and running");
export default redisClient;
