export interface IMapComponent {
  id: number;
  project: IProject;
  nomadInstances: INomadInstance[];
}

export interface IProject {
  id: number;
  icon: EIcon;
  name: string;
  healthyInstanceCount: number;
  instanceCount: number;
  open: boolean;
}

export interface INomadInstance {
  id: string;
  icon: EIcon;
  name: string;
  status: ENomadStatus;
}

export enum ENomadStatus {
  STOPPED = "dead",
  HEALTHY = "running",
}

export enum EIcon {
  GITLAB = "GITLAB",
  GITHUB = "GITHUB",
  NOMAD = "NOMAD",
}
