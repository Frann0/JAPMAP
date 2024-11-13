import { makeAutoObservable } from "mobx";
import {
  EIcon,
  IMapComponent,
  ENomadStatus,
} from "../interfaces/IMapComponent";
import { getMapping } from "../services/mappingService";

export class MapStore {
  mappings: IMapComponent[] = [
    {
      project: {
        id: 1,
        icon: EIcon.GITLAB,
        name: "Gitlab",
        healthyInstanceCount: 2,
        instanceCount: 3,
        open: false,
      },
      nomadInstances: [
        {
          id: "Nomad-1",
          icon: EIcon.NOMAD,
          name: "Nomad 1",
          status: ENomadStatus.HEALTHY,
        },
        {
          id: "Nomad-2",
          icon: EIcon.NOMAD,
          name: "Nomad 2",
          status: ENomadStatus.STOPPED,
        },
        {
          id: "Nomad-3",
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

  addMapping(mapping: IMapComponent) {
    if (!this.mappings.find((m) => m.project.id === mapping.project.id)) {
      this.mappings.push(mapping);
    }
  }

  toggleProject(id: number) {
    const project = this.mappings.find(
      (mapping) => mapping.project.id === id,
    )?.project;
    if (project) {
      project.open = !project.open;
    }
  }

  async fetchMapping(gitlabURL: string) {
    await getMapping(gitlabURL).then((mapping) => {
      const m = mapping as IMapComponent;
      m.project.open = false;
      this.addMapping(m);
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
}
