import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { gitlab } from "../http-gitlab";
import { buildMap, checkForNewNomadInstances, getAllMaps, getNomadInstances, signUp, updateNomadInstancesStatus } from "./querys/querys";
import { staticPlugin } from '@elysiajs/static'
import generateAvatar from "github-like-avatar-generator";
import cron from "@elysiajs/cron";

const generateProfilePicture = async (userId: string) => {
  const avatar = generateAvatar({
    blocks: 6,
    width: 100
  });
  //Filter out the base64 header
  const stripped = avatar.base64.replace("data:image/svg+xml;base64,", "");

  //Decode the base64 string
  const svg = atob(stripped);

  //Write the svg to a file
  await Bun.write(`./public/profilePictures/${userId}.svg`, svg);
}

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .use(cron({
    name: "Check for new Nomad instances",
    pattern: "*/1 * * * *",
    async run() {
      await updateNomadInstancesStatus()
    }
  }))
  .post("/addMap", async ({ body }) => {
    const { gitlabURL, userId } = body;
    return buildMap(gitlabURL, userId);
  }).get("/getMaps", async ({ query: { userId } }) => {
    if (!userId) {
      return { message: "No user id" };
    }
    return getAllMaps(userId);
  })
  .post("/signup", async ({ body }) => {
    await signUp(body);
    await generateProfilePicture(body.localId);
    //TODO: Update localhost in production
    return { message: "User signed up", profilePicture: `http://localhost:3000/public/profilePictures/${body.localId}.svg` };
  })
  .post("/generateProfilePicture", async ({ body }) => {
    const { userId } = body;
    generateProfilePicture(userId);
    return { message: "Profile picture generated" };
  })
  .post("/checkNomadInstances", async ({ body }) => {
    const { gitlabProjectId, userId } = body;
    return checkForNewNomadInstances(gitlabProjectId, userId);
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
