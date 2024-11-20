import { Request, Response, Router } from "express";

const spaceRouter = Router();

spaceRouter.post("/", (req: Request, res: Response) => {});
spaceRouter.delete("/:spaceId", (req: Request, res: Response) => {});
spaceRouter.get("/all", (req: Request, res: Response) => {});
spaceRouter.post("/element", (req: Request, res: Response) => {});
spaceRouter.delete("/element", (req: Request, res: Response) => {});
spaceRouter.get("/:spaceId", (req: Request, res: Response) => {});

export { spaceRouter };
