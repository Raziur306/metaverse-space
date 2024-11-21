import { Request, Response, Router } from "express";
import {
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
} from "../types";
import prisma from "@repo/db/client";

const adminRouter = Router();

adminRouter.post(
  "/element",

  async (req: Request, res: Response) => {
    try {
      const parsedData = CreateElementSchema.safeParse(req.body);
      if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error });
        return;
      }

      await prisma.element.create({
        data: {
          imageUrl: parsedData.data.imageUrl,
          width: parsedData.data.width,
          height: parsedData.data.height,
          static: parsedData.data.static,
        },
      });

      res.status(200).json({ message: "Element created" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

adminRouter.put(
  "/element/:elementId",

  async (req: Request, res: Response) => {
    try {
      const element = prisma.element.update({
        where: {
          id: req.params.elementId,
        },
        data: {
          imageUrl: req.body.imageUrl,
          width: req.body.width,
          height: req.body.height,
          static: req.body.static,
        },
      });
      if (!element) {
        res.status(404).json({ error: "Element not found" });
        return;
      }

      res.status(200).json({ message: "Element updated" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

adminRouter.post("/avatar", async (req: Request, res: Response) => {
  try {
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ error: parsedData.error });
      return;
    }

    await prisma.avatar.create({
      data: {
        name: parsedData.data.name,
        imageUrl: parsedData.data.imageUrl,
      },
    });

    res.status(200).json({ message: "Avatar created" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.get(
  "/map",

  async (req: Request, res: Response) => {
    try {
      const parsedData = CreateMapSchema.safeParse(req.body);
      if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error });
        return;
      }

      const createdMap = await prisma.map.create({
        data: {
          thumbnail: parsedData.data.thumbnail,
          width: parsedData.data.width,
          height: parsedData.data.height,
          name: parsedData.data.name,
          mapElement: {
            create: parsedData.data.elements.map((element) => ({
              elementId: element.elementId,
              x: element.x,
              y: element.y,
            })),
          },
        },
      });

      res.status(200).json({ id: createdMap.id, message: "Map created" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export { adminRouter };
