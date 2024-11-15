import { createContext, useContext } from "react";
import { MapStore } from "./mapStore";
import { AuthStore } from "./authStore";

type Store = {
  mapStore: MapStore;
  authStore: AuthStore;
};

export const store: Store = {
  mapStore: new MapStore(),
  authStore: new AuthStore(),
};

export const StoreContext = createContext<Store>({} as Store);

export const useStore = () => {
  return useContext(StoreContext);
};
