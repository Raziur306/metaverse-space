import { WebSocket } from "ws";
import { OutingMessage } from "./type";
import { RoomManager } from "./RoomManager";
import { generateRandomIdString } from "./utils/randomId";
import prisma from "@repo/db/client";

export class User {
  public id: string;
  constructor(private ws: WebSocket) {
    this.id = generateRandomIdString(10);
  }

  initHandlers() {
    this.ws.on("message", async (data) => {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "join": {
          const spaceId = parsedData.spaceId;
          const space = await prisma.space.findFirst({
            where: {
              id: spaceId,
            },
          });
          if (!space) {
            this.ws.close();
            return;
          }

          RoomManager.getInstance().addUserToRoom(spaceId, this);
          this.send({
            type: "join",
            payload: {
              spawnId: {
                x: Math.floor(Math.random() * space?.width),
                y: Math.floor(Math.random() * space?.height!),
              },
              users: RoomManager.getInstance()
                .rooms.get(spaceId)
                ?.map((u) => {
                  id: u.id;
                }),
            },
          });
        }
        case "move": {
            
        }
      }
    });
  }

  send(payload: OutingMessage) {
    this.ws.send(JSON.stringify(payload));
  }
}
