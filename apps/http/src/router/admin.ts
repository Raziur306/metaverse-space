import { Request, Response, Router } from "express";

const adminRouter = Router();

adminRouter.post("/element", (req: Request, res: Response) => {});
adminRouter.put("/element/:elementId", (req: Request, res: Response) => {});
adminRouter.get("/avatar", (req: Request, res: Response) => {});
adminRouter.get("/map", (req: Request, res: Response) => {});

export { adminRouter };
