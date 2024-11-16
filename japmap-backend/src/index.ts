import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { gitlab } from "../http-gitlab";
import { buildMap, getAllMaps, getNomadInstances, signUp } from "./querys/querys";

const app = new Elysia()
  .use(cors())
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
    return { message: "User signed up" };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
