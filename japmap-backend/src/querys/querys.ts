import { gitlab } from "../../http-gitlab";
import { nomad } from "../../http-nomad";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getGitlabProject = async (gitlabUrl: string) => {
  const strippedURL = gitlabUrl.replace("https://gitlab.com/", "");
  const encodedURL = encodeURIComponent(strippedURL);
  const gitlabResponse = await gitlab.get(`/projects/${encodedURL}`);

  return gitlabResponse.data;
};

export const getGitlabVariable = async (
  projectId: string,
  variableKey: string,
) => {
  const gitlabResponse = await gitlab.get(
    `/projects/${projectId}/variables/${variableKey}`,
  );
  const { value } = gitlabResponse.data;
  return value;
};

export const getNomadInstances = async (prefix: string) => {
  const nomadResponse = await nomad.get(`/jobs?namespace=*&prefix=${prefix}`);
  return filterNomadInstances(nomadResponse.data);
};

export const getNomadCount = (instances: any) => {
  return instances.length;
};

export const getNomadHealthyCount = (instances: any) => {
  return instances.filter(
    (instance: any) =>
      instance.Status === "running" || instance.status === "running",
  ).length;
};

export const transformNomadInstances = (instances: any) => {
  return instances.map((instance: any) => {
    return {
      id: instance.id,
      icon: "NOMAD",
      name: instance.name,
      status: instance.status,
    };
  });
};

const filterNomadInstances = (instances: any) => {
  return instances.filter((instance: any) => instance.Type === "service");
};

const transformMap = (map) => {
  console.log(map);
  return {
    project: {
      id: map.gitlabId,
      icon: "GITLAB",
      name: map.name,
      healthyInstanceCount: getNomadHealthyCount(map.nomadInstances),
      instanceCount: getNomadCount(map.nomadInstances),
    },
    nomadInstances: transformNomadInstances(map.nomadInstances),
  };
};

export const buildMap = async (gitlabUrl: string) => {
  const gitlabProject = await getGitlabProject(gitlabUrl);
  const prefix = await getGitlabVariable(gitlabProject.id, "JAPMAP_PREFIX");
  const instances = await getNomadInstances(prefix);

  //if the map already exists in the database, reutrn it instead of creating a new one
  const existingMap = await prisma.gitlabProject.findUnique({
    where: { gitlabId: gitlabProject.id },
    include: { nomadInstances: true },
  });
  if (existingMap) {
    return transformMap(existingMap);
  }

  const m = addMap(gitlabProject, instances, prefix).then((res) => {
    return transformMap(res);
  });

  return m;
};

export const getMap = async (gitlabProjectId) => {
  const map = await prisma.gitlabProject.findUnique({
    where: { gitlabId: gitlabProjectId },
    include: { nomadInstances: true },
  });
  return transformMap(map);
};

export const addMap = async (gitlabProject, nomadInstances, nomadPrefix) => {
  const newProject = await prisma.gitlabProject.create({
    data: {
      gitlabId: gitlabProject.id,
      name: gitlabProject.name,
      nomadPrefix: nomadPrefix,
      path: gitlabProject.path,
      namespace: gitlabProject.path_with_namespace,
      visibility: gitlabProject.visibility,
      description: gitlabProject.description,
      webUrl: gitlabProject.web_url,
    },
  });

  const newInstances = nomadInstances.map(async (instance) => {
    const newNomadInstance = await prisma.nomadInstance
      .create({
        data: {
          id: instance.ID,
          name: instance.Name,
          status: instance.Status,
          gitlabProjectId: newProject.gitlabId,
        },
      })
      .then((res) => {
        return res;
      });
    return newNomadInstance;
  });

  const map = await prisma.gitlabProject.findUnique({
    where: { gitlabId: newProject.gitlabId },
    include: { nomadInstances: true },
  });

  return map;
};

export const getAllMaps = async () => {
  const maps = await prisma.gitlabProject.findMany({
    include: { nomadInstances: true },
  });
  return maps.map((map) => transformMap(map));
}
