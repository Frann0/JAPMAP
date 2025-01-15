import { Prisma, PrismaClient } from "@prisma/client";
import {
  addMap,
  getGitlabProject,
  getGitlabVariable,
  getNomadInstances,
  transformMap,
} from "./querys";
import { transformGroupMap } from "../helpers/transformGroup";
import { nomad } from "../../http-nomad";

const prisma = new PrismaClient();

export const createGroup = async (name: string, userId: string) => {
  const group = await prisma.group.create({
    data: {
      name,
    },
    include: {
      users: true,
      GitlabProjects: true,
    },
  });

  const updatedGroup = await prisma.group.update({
    where: {
      id: group.id,
    },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      users: true,
      GitlabProjects: true,
    },
  });

  return transformGroupMap(updatedGroup);
};

export const getGroups = async () => {
  const groups = await prisma.group.findMany({
    include: {
      users: true,
      GitlabProjects: {
        include: {
          nomadInstances: true,
        },
      },
    },
  });

  return groups.map((group) => {
    return transformGroupMap(group);
  });
};

export const getGroupByUserId = async (userId: string) => {
  return await prisma.group.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  });
};

export const addUserToGroup = async (groupId: number, userId: string) => {
  //check if user is already in group
  //if user is already in group, return group
  //else add user to group and return group
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
      AND: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    },
    include: {
      users: true,
      GitlabProjects: {
        include: {
          nomadInstances: true,
        },
      },
    },
  });

  if (group) {
    return transformGroupMap(group);
  }

  const newGroup = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      users: true,
      GitlabProjects: {
        include: {
          nomadInstances: true,
        },
      },
    },
  });

  return transformGroupMap(newGroup);
};

export const removeUserFromGroup = async (groupId: number, userId: string) => {
  return await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      users: {
        disconnect: {
          id: userId,
        },
      },
    },
    include: {
      users: true,
      GitlabProjects: {
        include: {
          nomadInstances: true,
        },
      },
    },
  });
};

export const deleteGroup = async (groupId: number) => {
  return await prisma.group.delete({
    where: {
      id: groupId,
    },
  });
};

export const addProjectToGroup = async (
  gitlabUrl: string,
  groupId: number,
  userId: string,
  gitlabToken: string,
  nomadToken: string,
) => {
  const userApartOfGroup = await prisma.group.findUnique({
    where: {
      id: groupId,
      AND: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    },
    include: {
      users: true,
      GitlabProjects: {
        include: {
          nomadInstances: true,
        },
      },
    },
  });

  if (!userApartOfGroup) {
    return { error: "User is not apart of group" };
  }

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
      Groups: {
        some: {
          id: groupId,
        },
      },
    },
    include: { nomadInstances: true, Groups: true },
  });
  if (existingMap) {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        GitlabProjects: { include: { nomadInstances: true } },
        users: true,
      },
    });

    return transformGroupMap(group);
  }

  const m = addMapToGroup(gitlabProject, instances, prefix, groupId).then(
    (res) => {
      if (Object.keys(res).includes("error")) {
        return res;
      }

      return transformGroupMap(res);
    },
  );

  return m;
};

export const addMapToGroup = async (
  gitlabProject,
  nomadInstances,
  nomadPrefix: string,
  groupId: number,
) => {
  const existingProject = await prisma.gitlabProject.findFirst({
    where: {
      gitlabId: gitlabProject.id,
    },
  });

  if (existingProject) {
    const newProject = await prisma.gitlabProject.update({
      where: {
        gitlabId: gitlabProject.id,
      },
      data: {
        Groups: {
          connect: {
            id: groupId,
          },
        },
      },
      include: { nomadInstances: true, Groups: true },
    });

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        GitlabProjects: { include: { nomadInstances: true } },
        users: true,
      },
    });

    if (!group) {
      return { error: "Group not found" };
    }

    return group;
  }

  const newProject = await prisma.gitlabProject.create({
    data: {
      Groups: {
        connect: {
          id: groupId,
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

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
      GitlabProjects: {
        some: {
          gitlabId: newProject.gitlabId,
        },
      },
    },
    include: {
      GitlabProjects: { include: { nomadInstances: true } },
      users: true,
    },
  });
  return group;
};
