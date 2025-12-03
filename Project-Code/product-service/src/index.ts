import dotenv from "dotenv";
dotenv.config();
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import { userAuth } from "./middleware/userMiddleware.js";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/v1/category", userAuth, categoryRouter);
app.use("/api/v1/product", userAuth, productRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server is running",
  });
});

app.listen(PORT, () => {
  console.log("Product service is running on", PORT);
});
