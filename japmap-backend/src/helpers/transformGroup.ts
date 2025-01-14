import { getNomadCount, getNomadHealthyCount, transformNomadInstances } from "../querys/querys"

export const transformGroupMap = (group) => {
  return {
    id: group.id,
    name: group.name,
    users: group.users,
    projects: group.GitlabProjects.map((project) => {
      return {
        project: {
          id: project.gitlabId,
          icon: "GITLAB",
          name: project.name,
          healthyInstanceCount: getNomadHealthyCount(project.nomadInstances),
          instanceCount: getNomadCount(project.nomadInstances),
          open: false,
        },
        nomadInstances: transformNomadInstances(project.nomadInstances),
      }
    })
  }
}
