import { makeAutoObservable } from "mobx";
import {
  EIcon,
  IMapComponent,
  ENomadStatus,
} from "../interfaces/IMapComponent";
import { getAllMappings, addMapping } from "../services/mappingService";

export class MapStore {
  mappings: IMapComponent[] = [];

  setMappings(mappings: IMapComponent[]) {
    this.mappings = mappings;
  }

  pushMapping(mapping: IMapComponent) {
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

  async addMapping(gitlabURL: string) {
    await addMapping(gitlabURL).then((mapping) => {
      const m = mapping as IMapComponent;
      m.project.open = false;
      this.pushMapping(m);
    });
  }

  async fetchAllMappings() {
    const mappings = await getAllMappings();
    this.setMappings(mappings);
  }

  constructor() {
    makeAutoObservable(this);
  }
}
