import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@repo/db/client";

const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "object" && decoded.role === "User") {
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id!,
        },
      });
      if (!user) {
        res.status(404).json({ error: "Something went wrong" });
        return;
      }
      res.locals.userId = user.id;
      next();
    } else {
      res.status(403).json({ error: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

export default userMiddleware;
