import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import "dotenv/config";

// ✅ Initialize Redis connection
const redis = Redis.fromEnv();

// ✅ Initialize rate limiter (3 requests per 60 seconds sliding window)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
});

export default ratelimit;
