import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { buildMap, getAllMaps, signUp } from "./querys/querys";
import { staticPlugin } from "@elysiajs/static";
import generateAvatar from "github-like-avatar-generator";
import { listenToNomadStream } from "./helpers/nomad";
import {
  addProjectToGroup,
  addUserToGroup,
  createGroup,
  getGroups,
  removeUserFromGroup,
} from "./querys/groupQuerys";

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

const connectedClients: Map<string, any> = new Map();

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .ws("/ws", {
    open(ws) {
      connectedClients.set(ws.id, ws);
      console.log("Client connected");
    },
    close(ws) {
      connectedClients.delete(ws.id);
      console.log("Client disconnected");
    },
    message(ws, message) {
      ws.send(message);
    },
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
  .group("/group", (group) =>
    group
      .post("/create", async ({ body }) => {
        const { name, userId } = body;

        if (!name) {
          return { message: "No name provided" };
        }

        if (!userId) {
          return { message: "No user id provided" };
        }

        return await createGroup(name, userId);
      })
      .get("/", async () => {
        return await getGroups();
      })
      .post("/join", async ({ body }) => {
        const { groupId, userId } = body;

        if (!groupId) {
          return { message: "No group id provided" };
        }

        if (!userId) {
          return { message: "No user id provided" };
        }

        return await addUserToGroup(groupId, userId);
      })
      .post("/leave", async ({ body }) => {
        const { groupId, userId } = body;

        if (!groupId) {
          return { message: "No group id provided" };
        }

        if (!userId) {
          return { message: "No user id provided" };
        }

        return await removeUserFromGroup(groupId, userId);
      })
      .post("/addProject", async ({ body, headers }) => {
        const { groupId, userId, gitlabUrl } = body;
        const gitlabToken = headers["x-gitlab-token"];
        const nomadToken = headers["x-nomad-token"];

        if (!gitlabToken || !nomadToken) {
          return { message: "No tokens provided" };
        }

        if (!groupId) {
          return { message: "No group id provided" };
        }

        if (!userId) {
          return { message: "No user id provided" };
        }

        if (!gitlabUrl) {
          return { message: "No gitlab url provided" };
        }

        return await addProjectToGroup(
          gitlabUrl,
          groupId,
          userId,
          gitlabToken,
          nomadToken,
        );
      }),
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

const broadcast = (data: any) => {
  const messageToSend = JSON.stringify(data);

  connectedClients.forEach((client) => {
    client.send(messageToSend);
  });
};
listenToNomadStream(broadcast);
