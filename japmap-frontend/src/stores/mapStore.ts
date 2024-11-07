import { makeAutoObservable } from "mobx";
import {
  EIcon,
  IMapComponent,
  ENomadStatus,
} from "../interfaces/IMapComponent";

export class MapStore {
  mappings: IMapComponent[] = [
    {
      id: 1,
      project: {
        icon: EIcon.GITLAB,
        name: "Gitlab",
        healthyInstanceCount: 2,
        instanceCount: 3,
        open: false,
      },
      nomadInstances: [
        {
          icon: EIcon.NOMAD,
          name: "Nomad 1",
          status: ENomadStatus.HEALTHY,
        },
        {
          icon: EIcon.NOMAD,
          name: "Nomad 2",
          status: ENomadStatus.STOPPED,
        },
        {
          icon: EIcon.NOMAD,
          name: "Nomad 3",
          status: ENomadStatus.HEALTHY,
        },
      ],
    },
  ];

  setMappings(mappings: IMapComponent[]) {
    this.mappings = mappings;
  }

  toggleProject(id: number) {
    const project = this.mappings.find((mapping) => mapping.id === id)?.project;
    if (project) {
      project.open = !project.open;
    }
  }

  constructor() {
    makeAutoObservable(this);
  }
}
