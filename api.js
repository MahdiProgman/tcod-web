// Import Requirements
import express from "express";
import fileUpload from "express-fileupload";
import apiRouter from "./src/routes/index.js";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import "express-async-errors";
import ActivationCode from "./src/models/activationCode.js";
import schedule from "node-schedule";

// Make a Express App
const api = express();
// Use Helmet Middlewares
api.use(helmet.xssFilter());
api.use(helmet.xPoweredBy());
// Use a middleware for setup public folder
api.use(express.static("public"));
// Use Urlencoded Middleware
api.use(express.urlencoded({ extended: true }));
// Use JSON Middleware
api.use(express.json());

// Use a Middleware For Uploading Files and Configure Limit Of Files
api.use(
  fileUpload({
    limits: {
      fileSize: 2048 * 1024 * 1024,
    },
  })
);

schedule.scheduleJob("5 * * * * *", async () => {
  const activationCodes = await ActivationCode.find();
  activationCodes.forEach(async (activationCode) => {
    if (activationCode.expire > Date.now()) {
      await ActivationCode.deleteOne({
        email: activationCode.email,
        code: activationCode.code,
        expire: activationCode.expire,
      });
    }
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Apply the rate limiting middleware to all requests.
api.use(limiter);

// The Api Router
api.use("/api", apiRouter);

// The Middleware Will Run When Route Of Request Is Not Found On api Router
api.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: "Not Found",
  });
});

// The Middleware Will Run When App On Error
api.use((err, req, res, next) => {
  res.status(500).json({
    statusCode: 500,
    data: null,
    token: null,
    message: "Internal Server Error",
    errors: [],
  });
});

// Export The Configured Express App For Use
export default api;
