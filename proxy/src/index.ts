import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import proxies (adjust the path as needed)
import { authProxy, basicProxy, submissionProxy, adminProxy } from "./proxy.js";

const app = express();
const port = process.env.PORT || 4000;

// 🧱 Rate limiter
const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message:
    "1000 requests inside 20 minutes?!?! Are you seriously interested in this shit I built?! Man, you need a break for sure. Wait—are you a DOS attacker?? Is this crap that important to implement a DOS attack? ... man I did a pretty good job ig **sob sob..",
});

// 🧩 Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
// app.use(limiter); // Uncomment if you want to enable rate limiting

// 🪵 Logger middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`Yo this request is now getting called - ${req.path}`);
  next();
});

// 🧭 Proxy routes
app.use("/login-signup", authProxy);
app.use("/basic", basicProxy);
app.use("/submission", submissionProxy);
app.use("/admin", adminProxy);

// 🚀 Start server
app.listen(port, () => {
  console.log(`Backend routes are handled with proxies here at port - ${port}`);
});
