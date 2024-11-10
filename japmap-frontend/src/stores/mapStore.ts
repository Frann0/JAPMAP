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
      id: 1,
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
    this.mappings.push(mapping);
  }

  toggleProject(id: number) {
    const project = this.mappings.find((mapping) => mapping.id === id)?.project;
    if (project) {
      project.open = !project.open;
    }
  }

  fetchMapping(gitlabURL: string) {
    getMapping(gitlabURL).then((mapping) => {
      const m = mapping as IMapComponent;
      m.project.open = false;
      console.log(m);
      this.addMapping(m);
      console.log(this.mappings);
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
}
