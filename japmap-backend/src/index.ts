import { Context, Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { gitlab } from "../http-gitlab";
import {
  buildMap,
  checkForNewNomadInstances,
  getAllMaps,
  getNomadInstances,
  signUp,
  updateNomadInstancesStatus,
} from "./querys/querys";
import { staticPlugin } from "@elysiajs/static";
import generateAvatar from "github-like-avatar-generator";
import cron from "@elysiajs/cron";
import { listenToNomadStream } from "./helpers/nomad";
import { ServerWebSocket } from "bun";

const generateProfilePicture = async (userId: string) => {
  const avatar = generateAvatar({
    blocks: 6,
    width: 100,
  });
  //Filter out the base64 header
  const stripped = avatar.base64.replace("data:image/svg+xml;base64,", "");

  //Decode the base64 string
  const svg = atob(stripped);

  //Write the svg to a file
  await Bun.write(`./public/profilePictures/${userId}.svg`, svg);
};

const connectedClients: Set<any> = new Set();

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .use(
    cron({
      name: "Check for new Nomad instances",
      pattern: "*/1 * * * *",
      async run() {
        if (!process.env.NOMAD_TOKEN) {
          return;
        }
        //await updateNomadInstancesStatus(process.env.NOMAD_TOKEN);
      },
    }),
  ).ws("/ws", {
    open(ws) {
      connectedClients.add(ws);
      console.log("Client connected");
    },
    close(ws) {
      connectedClients.delete(ws);
      console.log("Client disconnected");
    },
    message(ws, message) {
      ws.send(message);
    }
  })
  .post("/addMap", async ({ body, headers }) => {
    const { gitlabURL, userId } = body;
    const gitlabToken = headers["x-gitlab-token"];
    const nomadToken = headers["x-nomad-token"];
    if (!gitlabToken || !nomadToken) {
      return { message: "No tokens provided" };
    }

    return buildMap(gitlabURL, userId, gitlabToken, nomadToken);
  })
  .get("/getMaps", async ({ query: { userId }, headers }) => {
    if (!userId) {
      return { message: "No user id" };
    }
    const gitlabToken = headers["x-gitlab-token"];
    const nomadToken = headers["x-nomad-token"];
    if (!gitlabToken || !nomadToken) {
      return { message: "No tokens provided" };
    }
    return getAllMaps(userId, nomadToken);
  })
  .post("/signup", async ({ body }) => {
    await signUp(body);
    await generateProfilePicture(body.localId);
    //TODO: Update localhost in production
    return {
      message: "User signed up",
      profilePicture: `http://localhost:3000/public/profilePictures/${body.localId}.svg`,
    };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

const broadcast = (data: any) => {
  const messageToSend = JSON.stringify(data);

  console.log("Broadcasting message:", messageToSend);
  console.log("Connected clients:", connectedClients.size);
  connectedClients.forEach((client) => {
    client.send(messageToSend);
  })
}
listenToNomadStream(broadcast);

