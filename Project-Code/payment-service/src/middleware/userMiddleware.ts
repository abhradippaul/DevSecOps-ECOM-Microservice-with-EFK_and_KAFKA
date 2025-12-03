import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";

export const userAuth = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (c, next) => {
  const auth = getAuth(c);

  if (!auth?.userId || !auth.isAuthenticated) {
    return c.json({
      message: "You are not logged in.",
    });
  }

  c.set("userId", auth.userId);

  await next();
});
