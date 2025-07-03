// backend/config/upstash.js
import { RateLimiter } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new RateLimiter({
  redis,
  limiter: RateLimiter.fixedWindow(5, "10 s"), // e.g., 5 reqs per 10 sec
});

export default ratelimit;
