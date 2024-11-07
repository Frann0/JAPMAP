import { ReactNode } from "react";

export interface IRoute {
  path: string;
  component: React.FC;
  name: string;
  icon?: string;
}
