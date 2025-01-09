import { gitlab } from "../../http-gitlab";
import { nomad } from "../../http-nomad";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getGitlabProject = async (
  gitlabUrl: string,
  gitlabToken: string,
) => {
  const strippedURL = gitlabUrl.replace("https://gitlab.com/", "");
  const encodedURL = encodeURIComponent(strippedURL);
  const gitlabResponse = await gitlab.get(`/projects/${encodedURL}`, {
    headers: {
      "PRIVATE-TOKEN": gitlabToken,
    },
  });

  return gitlabResponse.data;
};

export const getGitlabVariable = async (
  projectId: string,
  variableKey: string,
  gitlabToken: string,
) => {
  const gitlabResponse = await gitlab.get(
    `/projects/${projectId}/variables/${variableKey}`,
    {
      headers: {
        "PRIVATE-TOKEN": gitlabToken,
      },
    },
  );
  const { value } = gitlabResponse.data;
  return value;
};

export const getNomadInstances = async (prefix: string, nomadToken: string) => {
  const nomadResponse = await nomad.get(`/jobs?namespace=*&prefix=${prefix}`, {
    headers: {
      "X-Nomad-Token": nomadToken,
    },
  });
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

export const buildMap = async (
  gitlabUrl: string,
  userId: string,
  gitlabToken: string,
  nomadToken: string,
) => {
  const gitlabProject = await getGitlabProject(gitlabUrl, gitlabToken);
  const prefix = await getGitlabVariable(
    gitlabProject.id,
    "JAPMAP_PREFIX",
    gitlabToken,
  );
  const instances = await getNomadInstances(prefix, nomadToken);

  //if the map already exists in the database, reutrn it instead of creating a new one
  const existingMap = await prisma.gitlabProject.findFirst({
    where: {
      gitlabId: gitlabProject.id,
      Users: {
        some: {
          id: userId,
        },
      },
    },
    include: { nomadInstances: true },
  });
  if (existingMap) {
    return transformMap(existingMap);
  }

  const m = addMap(gitlabProject, instances, prefix, userId).then((res) => {
    return transformMap(res);
  });

  return m;
};

export const getMap = async (gitlabProjectId: number, userId: string) => {
  const map = await prisma.gitlabProject.findUnique({
    where: {
      gitlabId: gitlabProjectId,
      Users: {
        some: {
          id: userId,
        },
      },
    },
    include: { nomadInstances: true },
  });
  return transformMap(map);
};

export const addMap = async (
  gitlabProject,
  nomadInstances,
  nomadPrefix: string,
  userId: string,
) => {
  const existingProject = await prisma.gitlabProject.findFirst({
    where: {
      gitlabId: gitlabProject.id,
    },
  });

  if (existingProject) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return;
    }

    const newProject = await prisma.gitlabProject.update({
      where: {
        gitlabId: gitlabProject.id,
      },
      data: {
        Users: {
          connect: {
            id: userId,
          },
        },
      },
      include: { nomadInstances: true },
    });

    return newProject;
  }

  const newProject = await prisma.gitlabProject.create({
    data: {
      Users: {
        connect: {
          id: userId,
        },
      },
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
    where: {
      gitlabId: newProject.gitlabId,
      Users: {
        some: {
          id: userId,
        },
      },
    },
    include: { nomadInstances: true },
  });

  return map;
};

export const getAllMaps = async (userId: string) => {
  await purgeNomadInstances(userId);

  await checkForNewNomadInstances(userId);

  const maps = await prisma.gitlabProject.findMany({
    where: {
      Users: {
        some: {
          id: userId,
        },
      },
    },
    include: { nomadInstances: true },
  });

  return maps.map((map) => transformMap(map));
};

export const signUp = async (user) => {
  const u = await prisma.user.create({
    data: {
      displayName: user.displayName,
      email: user.email,
      id: user.localId,
      emailVerified: user.emailVerified,
    },
  });
  console.log(u);
  return u;
};

export const checkForNewNomadInstances = async (
  userId: string,
  nomadToken: string,
) => {
  const projects = await prisma.gitlabProject.findMany({
    where: {
      Users: {
        some: {
          id: userId,
        },
      },
    },
    include: { nomadInstances: true },
  });

  for (const project of projects) {
    const prefix = project.nomadPrefix;
    const instances = await getNomadInstances(prefix, nomadToken);

    //Filter out instances that already exist in the database
    const newInstances = instances.filter((instance) => {
      return !project.nomadInstances.some(
        (oldInstance) => oldInstance.id === instance.ID,
      );
    });

    //Add new instances to the database
    const newInstancesDB = await Promise.all(
      newInstances.map(async (instance) => {
        const newNomadInstance = await prisma.nomadInstance
          .create({
            data: {
              id: instance.ID,
              name: instance.Name,
              status: instance.Status,
              gitlabProjectId: project.gitlabId,
            },
          })
          .then((res) => {
            return res;
          });
        return newNomadInstance;
      }),
    );

    //Update the project with the new instances
    await prisma.gitlabProject.update({
      where: {
        gitlabId: project.gitlabId,
      },
      data: {
        nomadInstances: {
          connect: newInstancesDB,
        },
      },
      include: { nomadInstances: true },
    });
  }
};

const purgeNomadInstances = async (userId: string, nomadToken: string) => {
  //For all projects for the user, get all nomad instances and delete them if they do not exist on the list from the nomad API
  const projects = await prisma.gitlabProject.findMany({
    where: {
      Users: {
        some: {
          id: userId,
        },
      },
    },
    include: { nomadInstances: true },
  });

  for (const project of projects) {
    const prefix = project.nomadPrefix;
    const instances = await getNomadInstances(prefix, nomadToken);

    const instancesToDelete = project.nomadInstances.filter((instance) => {
      return !instances.some((newInstance) => instance.id === newInstance.ID);
    });

    await prisma.nomadInstance.deleteMany({
      where: {
        id: {
          in: instancesToDelete.map((instance) => instance.id),
        },
      },
    });
  }
};

export const updateNomadInstancesStatus = async (nomadToken: string) => {
  const instances = await prisma.nomadInstance.findMany();

  for (const instance of instances) {
    const nomadResponse = await nomad.get(`/job/${instance.id}`, {
      headers: {
        "X-Nomad-Token": nomadToken,
      },
    });
    const status = nomadResponse.data.Status;
    await prisma.nomadInstance.update({
      where: {
        id: instance.id,
      },
      data: {
        status: status,
      },
    });
  }
};
