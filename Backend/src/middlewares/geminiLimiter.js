// middlewares/geminiLimiter.js
import rateLimit from "express-rate-limit";

export const geminiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour window
  max: 10,                   // limit each IP to 10 requests per hour
  message: "Rate limit exceeded for AI generation. Try again after an hour.",
  standardHeaders: true,
  legacyHeaders: false,
});
