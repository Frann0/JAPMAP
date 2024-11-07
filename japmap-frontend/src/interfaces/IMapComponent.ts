export interface IMapComponent {
  id: number;
  project: IProject;
  nomadInstances: INomadInstance[];
}

export interface IProject {
  icon: EIcon;
  name: string;
  healthyInstanceCount: number;
  instanceCount: number;
  open: boolean;
}

export interface INomadInstance {
  icon: EIcon;
  name: string;
  status: ENomadStatus;
}

export enum ENomadStatus {
  STOPPED = "STOPPED",
  HEALTHY = "HEALTHY",
}

export enum EIcon {
  GITLAB = "GITLAB",
  GITHUB = "GITHUB",
  NOMAD = "NOMAD",
}
