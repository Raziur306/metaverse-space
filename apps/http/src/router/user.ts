import { Request, Response, Router } from "express";
import { UpdateMetaDataSchema } from "../types";
import prisma from "@repo/db/client";

const userRouter = Router();

userRouter.post("/metadata", async (req: Request, res: Response) => {
  const parsedData = UpdateMetaDataSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error });
    return;
  }

  try {
    await prisma.user.update({
      where: {
        id: res.locals.userId,
      },
      data: {
        avatarId: parsedData.data.avatarId,
      },
    });

    res.status(200).json({ message: "Metadata updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.post("/metadata/bulk", async (req: Request, res: Response) => {
  try {
    const userIdsString = (req.query.ids ?? "[]") as String;
    const userIds = userIdsString.slice(1, -1).split(",");
    const metaData = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        avatar: true,
        id: true,
      },
    });

    res.json(200).json({
      avatars: metaData.map((data) => ({
        id: data.id,
        avatar: data.avatar?.imageUrl,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { userRouter };
