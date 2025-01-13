import { createContext, useContext } from "react";
import { MapStore } from "./mapStore";
import { AuthStore } from "./authStore";
import { SocketStore } from "./socketStore";

type Store = {
  mapStore: MapStore;
  authStore: AuthStore;
  socketStore: SocketStore
};

export const store: Store = {
  mapStore: new MapStore(),
  authStore: new AuthStore(),
  socketStore: new SocketStore()
};

export const StoreContext = createContext<Store>({} as Store);

export const useStore = () => {
  return useContext(StoreContext);
};
