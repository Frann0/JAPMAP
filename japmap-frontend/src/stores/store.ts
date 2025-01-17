import { createContext, useContext } from "react";
import { MapStore } from "./mapStore";
import { AuthStore } from "./authStore";
import { SocketStore } from "./socketStore";
import { GroupStore } from "./groupStore";

type Store = {
  mapStore: MapStore;
  authStore: AuthStore;
  socketStore: SocketStore;
  groupStore: GroupStore;
};

export const store: Store = {
  mapStore: new MapStore(),
  authStore: new AuthStore(),
  socketStore: new SocketStore(),
  groupStore: new GroupStore(),
};

export const StoreContext = createContext<Store>({} as Store);

export const useStore = () => {
  return useContext(StoreContext);
};
