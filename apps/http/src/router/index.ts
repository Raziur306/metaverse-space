import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SignInSchema, SignUpSchema } from "../types";
import prisma from "@repo/db/client";
import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

//signin user
router.post("/signin", async (req: express.Request, res: express.Response) => {
  const parsedData = SignInSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error });
    return;
  }
  try {
    const existUser = await prisma.user.findUnique({
      where: {
        email: parsedData.data.email,
      },
    });
    if (!existUser) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const isValid = bcrypt.compare(
      parsedData.data.password,
      existUser.password
    );

    if (!isValid) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: existUser.id, email: existUser.email, role: existUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//signup user
router.post("/signup", async (req: Request, res: Response) => {
  const parsedData = SignUpSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error });
    return;
  }
  try {
    const exitUser = await prisma.user.findUnique({
      where: {
        email: parsedData.data.email,
      },
    });
    if (exitUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: parsedData.data.email,
        password: hashedPassword,
        name: parsedData.data.name,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/element", (req: Request, res: Request) => {});
router.get("/avatars", (req: Request, res: Response) => {});

//import router
router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);

export { router };
