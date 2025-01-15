import { makeAutoObservable } from "mobx";
import { IGroup } from "../interfaces/IGroup";
import {
  addProjectToGroup,
  addUserToGroup,
  createGroup,
  getGroups,
} from "../services/groupService";
import { transformNomadStatus } from "../helpers/NomadStatus";
import { ENomadStatus } from "../interfaces/IMapComponent";

export class GroupStore {
  groups: IGroup[] = [];
  selectedGroup: any | null = null;
  selectedGroupProjects: any[] = [];

  setGroups(groups: IGroup[]) {
    this.groups = groups;
  }

  setSelectedGroup(group: IGroup) {
    this.selectedGroup = group;
  }

  setSelectedGroupProjects(projects: any[]) {
    this.selectedGroupProjects = projects;
  }

  toggleProject = (id: number) => {
    const project = this.selectedGroupProjects.find(
      (p) => p.project.id === id,
    ).project;
    if (project) {
      project.open = !project.open;
    }
  };

  updateStatus = (id: string, status: string) => {
    const project = this.findProjectOnNomadId(id);
    console.log("Project", project);

    if (!project) {
      return;
    }

    const t = (project.nomadInstances.find((n) => n.id === id)!.status =
      transformNomadStatus(status) as ENomadStatus);

    console.log(t);

    project.project.instanceCount = project.nomadInstances.length;
    project.project.healthyInstanceCount = project.nomadInstances.filter(
      (n) => n.status === ENomadStatus.HEALTHY,
    ).length;
  };

  findProjectOnNomadId(id: string) {
    const foundProject = this.selectedGroupProjects.find((project) =>
      project.nomadInstances.find((instance) => instance.id === id),
    );
    return foundProject;
  }

  createGroup = async (name: string, userId: string) => {
    const response = await createGroup(name, userId);

    if (response.error) {
      console.log(response.error);
      return;
    }

    if (!this.findGroupById(response.id)) {
      this.groups.push(response);
    }
  };

  getGroups = async () => {
    const response = await getGroups();

    if (response.error) {
      console.log(response.error);
      return;
    }

    this.setGroups(response);
  };

  findGroupById = (id: number) => {
    return this.groups.find((group) => group.id === id);
  };

  findGroupIndexById = (id: number) => {
    return this.groups.findIndex((group) => group.id === id);
  };

  joinGroup = async (groupId: number, userId: string) => {
    const response = await addUserToGroup(groupId, userId);

    const groupIndex = this.findGroupIndexById(groupId);

    if (response.error) {
      console.log(response.error);
      return;
    }

    if (groupIndex === -1) {
      this.groups.push(response);
    } else {
      this.groups[groupIndex] = response;
    }
  };

  addProjectToGroup = async (
    groupId: number,
    userId: string,
    gitlabUrl: string,
  ) => {
    const response = await addProjectToGroup(groupId, userId, gitlabUrl);

    const groupIndex = this.findGroupIndexById(groupId);

    if (response.error) {
      console.log(response.error);
      return;
    }

    if (groupIndex === -1) {
      this.groups.push(response);
    } else {
      this.groups[groupIndex] = response;
    }

    this.setSelectedGroup(response);
    this.setSelectedGroupProjects(response.projects);
  };

  constructor() {
    makeAutoObservable(this);
  }
}
