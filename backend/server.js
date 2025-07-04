import express from "express";
import dotenv from "dotenv";
import initDB from "./config/db.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import ratelimiter from "./middleware/ratelimiter.js";
import job from "./config/cron.js";

dotenv.config();

const port = process.env.PORT || 3001;
const app = express();

if (process.env.NODE_ENV !== "production") job.start();

app.use(ratelimiter);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
  });
});
