import { gitlab } from "../../http-gitlab";
import { nomad } from "../../http-nomad";

export const getGitlabProject = async (gitlabUrl: string) => {
  const strippedURL = gitlabUrl.replace("https://gitlab.com/", "");
  const encodedURL = encodeURIComponent(strippedURL);
  const gitlabResponse = await gitlab.get(`/projects/${encodedURL}`);

  const { id, name } = gitlabResponse.data;
  return { id, name };
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
  return instances.filter((instance: any) => instance.Status === "running")
    .length;
};

export const transformNomadInstances = (instances: any) => {
  return instances.map((instance: any) => {
    return {
      id: instance.ID,
      icon: "NOMAD",
      name: instance.Name,
      status: instance.Status,
    };
  });
};

const filterNomadInstances = (instances: any) => {
  return instances.filter((instance: any) => instance.Type === "service");
};

export const buildMap = async (gitlabUrl: string) => {
  const { id, name } = await getGitlabProject(gitlabUrl);
  const prefix = await getGitlabVariable(id, "JAPMAP_PREFIX");
  const instances = await getNomadInstances(prefix);

  const map = {
    id: 2,
    project: {
      id: id,
      icon: "GITLAB",
      name: name,
      healthyInstanceCount: getNomadHealthyCount(instances),
      instanceCount: getNomadCount(instances),
    },
    nomadInstances: transformNomadInstances(instances),
  };

  return map;
};
