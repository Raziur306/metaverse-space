import { Request, Response, Router } from "express";
import {
  AddElementSchema,
  CreateSpaceSchema,
  RemoveElementSchema,
} from "../types";
import prisma from "@repo/db/client";

const spaceRouter = Router();

spaceRouter.post("/", async (req: Request, res: Response) => {
  try {
    const parsedData = CreateSpaceSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ error: parsedData.error });
      return;
    }

    if (!parsedData.data.mapId) {
      await prisma.space.create({
        data: {
          name: parsedData.data.name,
          width: parsedData.data.width || 0,
          height: parsedData.data.height || 0,
          creatorId: res.locals.userId,
        },
      });
      res.json({ message: "Space created" });
      return;
    }

    const map = await prisma.map.findUnique({
      where: {
        id: parsedData.data.mapId,
      },
      select: {
        mapElement: true,
        width: true,
        height: true,
      },
    });

    if (!map) {
      res.status(400).json({ error: "Map not found" });
      return;
    }

    const space = await prisma.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: res.locals.userId,
        elements: {
          create: map.mapElement.map((element) => ({
            elementId: element.elementId,
            x: element.x,
            y: element.y,
          })),
        },
      },
    });

    res.json({ message: "Space created", spaceId: space.id });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

spaceRouter.delete("/:spaceId", async (req: Request, res: Response) => {
  try {
    await prisma.space.delete({
      where: {
        id: req.params.spaceId,
        creatorId: res.locals.userId,
      },
    });

    res.send(200).json({ message: "Space deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

spaceRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const spaces = await prisma.space.findMany({
      where: {
        creatorId: res.locals.userId,
      },
    });

    res.send(200).json({
      spaces: spaces.map((space) => ({
        id: space.id,
        name: space.name,
        thumbnail: space.thumbnail,
        width: space.width,
        height: space.height,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

spaceRouter.post("/element", async (req: Request, res: Response) => {
  try {
    const parsedData = AddElementSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ error: parsedData.error });
      return;
    }

    const space = await prisma.space.findUnique({
      where: {
        id: parsedData.data.spaceId,
        creatorId: res.locals.userId,
      },
    });

    if (!space) {
      res.status(400).json({ error: "Space not found" });
      return;
    }

    await prisma.spaceElement.create({
      data: {
        spaceId: parsedData.data.spaceId,
        elementId: parsedData.data.elementId,
        x: parsedData.data.x,
        y: parsedData.data.y,
      },
    });

    res.status(200).json({ message: "Element added" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

spaceRouter.delete("/element", async (req: Request, res: Response) => {
  try {
    const parsedData = RemoveElementSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ error: parsedData.error });
      return;
    }

    const space = await prisma.space.findUnique({
      where: {
        id: parsedData.data.spaceId,
        creatorId: res.locals.userId,
      },
    });

    if (!space) {
      res.status(400).json({ error: "Space not found" });
      return;
    }

    await prisma.spaceElement.delete({
      where: {
        spaceId: parsedData.data.spaceId,
        id: parsedData.data.elementId,
      },
    });

    res.status(200).json({ message: "Element deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

spaceRouter.get("/:spaceId", async (req: Request, res: Response) => {
  try {
    const space = await prisma.space.findUnique({
      where: {
        id: req.params.spaceId,
        creatorId: res.locals.userId,
      },
      include: {
        elements: {
          include: {
            element: true,
          },
        },
      },
    });

    if (!space) {
      res.status(400).json({ error: "Space not found" });
      return;
    }

    res.status(200).json({
      id: space.id,
      width: space.width,
      height: space.height,
      elements: space.elements.map((element) => ({
        id: element.id,
        element: element.element,
        x: element.x,
        y: element.y,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { spaceRouter };
