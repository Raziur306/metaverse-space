import { Request, Response, Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";

const router = Router();

router.post("signin", (req: Request, res: Response) => {});
router.post("/signup", (req: Request, res: Response) => {});
router.get("/element", (req: Request, res: Request) => {});
router.get("/avatars", (req: Request, res: Response) => {});

//import router
router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);

export { router };
