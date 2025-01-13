import { ENomadStatus } from "../interfaces/IMapComponent";

export const transformNomadStatus = (nomadStatus: string) => {

  switch (nomadStatus) {
    case "dead":
      return ENomadStatus.STOPPED;
    case "running":
      return ENomadStatus.HEALTHY;
    default:
      return ENomadStatus.STOPPED;
  }
}
