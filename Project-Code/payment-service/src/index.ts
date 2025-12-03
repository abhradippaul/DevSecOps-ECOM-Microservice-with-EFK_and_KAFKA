import dotenv from "dotenv";
dotenv.config();
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { userAuth } from "./middleware/userMiddleware.js";

const app = new Hono();

app.get("/", userAuth, (c) => {
  console.log(c.get("userId"));
  return c.text("Hello Hono!");
});

app.get("/api/v1/health", (c) => {
  return c.text("Server is healthy");
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT)!,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
