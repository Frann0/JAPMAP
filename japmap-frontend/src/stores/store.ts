import { createContext, useContext } from "react";

type Store = {};

export const store: Store = {};

export const StoreContext = createContext<Store>({} as Store);

export const useStore = () => {
  return useContext(StoreContext);
};
