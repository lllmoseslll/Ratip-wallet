import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res
        .status(429)
        .json({ error: "Rate limit exceeded. Please try again later." });
    }
    next();
  } catch (error) {
    console.error("Error in rate limiter middleware:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default ratelimiter;
