import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { gitlab } from "../http-gitlab";
import { buildMap, getAllMaps, getNomadInstances } from "./querys/querys";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
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

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
