import { create, StoreApi } from "zustand";
import { createFileSlice, FileSlice } from "./files.store";

type AppStore = FileSlice;

type SetFunction = StoreApi<AppStore>["setState"];
type GetFunction = StoreApi<AppStore>["getState"];

export type StoreSlice<T> = (set: SetFunction, get: GetFunction) => T;

const appStore = create<AppStore>((set, get, api) => ({
  ...createFileSlice(set, get, api), // Spread the created file slice
}));

export default appStore;
