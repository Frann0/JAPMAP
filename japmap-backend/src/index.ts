import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { gitlab } from "../http-gitlab";
import { buildMap, getAllMaps, getNomadInstances, signUp } from "./querys/querys";

const app = new Elysia()
  .use(cors())
  .post("/test", async ({ body }) => {
    const { gitlabURL } = body;
    return buildMap(gitlabURL);
  })
  .post("/test2", async ({ body }) => {
    const { prefix } = body;
    return getNomadInstances(prefix);
  }).get("/getMaps", async () => {
    return getAllMaps();
  })
  .post("/signup", async ({ body }) => {
    console.log(body);
    await signUp(body);
    return { message: "User signed up" };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
