import { WebSocket } from "ws";
import { OutingMessage } from "./type";
import { RoomManager } from "./RoomManager";
import { generateRandomIdString } from "./utils/randomId";
import prisma from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";

export class User {
  public id: string;
  private x: number;
  private y: number;
  private userId?: string;
  private spaceId?: string;

  constructor(private ws: WebSocket) {
    this.id = generateRandomIdString(10);
    this.x = 0;
    this.y = 0;
  }

  initHandlers() {
    this.ws.on("message", async (data) => {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "join": {
          this.spaceId = parsedData.payload.spaceId;
          const token = parsedData.payload.token;
          if (!token) {
            this.ws.close();
            return;
          }

          const userId = (
            jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
          ).userId;
          if (!userId) {
            this.ws.close();
            return;
          }
          this.userId = userId;

          const space = await prisma.space.findFirst({
            where: {
              id: this.spaceId,
            },
          });
          if (!space) {
            this.ws.close();
            return;
          }

          RoomManager.getInstance().addUserToRoom(this.spaceId!, this);
          this.x = Math.floor(Math.random() * space?.width);
          this.y = Math.floor(Math.random() * space?.height!);

          this.send({
            type: "space-joined",
            payload: {
              spawn: {
                x: this.x,
                y: this.y,
              },
              users: RoomManager.getInstance()
                .rooms.get(this.spaceId!)
                ?.filter((x) => x.id !== this.id)
                ?.map((u) => {
                  id: u.id;
                }),
            },
          });

          RoomManager.getInstance().boardCastToRoom(
            {
              type: "user-joined",
              payload: {
                userId: this.userId,
                x: this.x,
                y: this.y,
              },
            },
            this,
            this.spaceId!
          );

          break;
        }
        case "movement": {
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;
          this.x = moveX;
          this.y = moveY;

          const xDisplacement = Math.abs(this.x - moveX);
          const yDisplacement = Math.abs(this.y - moveY);

          if (
            (xDisplacement == 1 && yDisplacement == 0) ||
            (xDisplacement == 0 && yDisplacement == 1)
          ) {
            this.x = moveX;
            this.y = moveY;

            RoomManager.getInstance().boardCastToRoom(
              {
                type: "move",
                payload: {
                  id: this.id,
                  x: this.x,
                  y: this.y,
                },
              },
              this,
              this.spaceId!
            );
            return;
          }

          this.send({
            type: "movement-rejected",
            payload: {
              x: this.x,
              y: this.y,
            },
          });
        }
      }
    });
  }

  send(payload: OutingMessage) {
    this.ws.send(JSON.stringify(payload));
  }

  destroy() {
    RoomManager.getInstance().boardCastToRoom(
      {
        type: "user-left",
        payload: {
          userId: this.userId,
        },
      },
      this,
      this.spaceId!
    );
    RoomManager.getInstance().removeUserFromRoom(this.spaceId!, this);
  }
}
