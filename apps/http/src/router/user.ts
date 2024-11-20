import { Request, Response, Router } from "express";



const userRouter = Router();

userRouter.post("/metadata", (req: Request, res: Response) => {});
userRouter.post("/metadata/bulk", (req: Request, res: Response) => {});

export { userRouter };
