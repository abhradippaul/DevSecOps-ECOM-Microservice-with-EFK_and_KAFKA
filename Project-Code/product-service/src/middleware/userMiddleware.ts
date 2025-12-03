import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);

  if (!auth.userId || !auth.isAuthenticated) {
    return res.status(401).json({ message: "You are not logged in!" });
  }

  req.userId = auth.userId;

  return next();
};

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    return res.status(401).json({ message: "You are not logged in!" });
  }

  const claims = auth.sessionClaims as any;

  if (claims.metadata?.role !== "admin") {
    return res.status(403).send({ message: "Unauthorized!" });
  }

  req.userId = auth.userId;

  return next();
};
