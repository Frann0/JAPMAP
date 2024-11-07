import { createContext, useContext } from "react";
import { MapStore } from "./mapStore";

type Store = {
  mapStore: MapStore;
};

export const store: Store = {
  mapStore: new MapStore(),
};

export const StoreContext = createContext<Store>({} as Store);

export const useStore = () => {
  return useContext(StoreContext);
};
