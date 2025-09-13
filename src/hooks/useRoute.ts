import { create } from "zustand";

const useRoute = create<{
  route: { lat: number; lng: number; }[];
  setRoute: (route: { lat: number; lng: number; }[]) => void;
}>(
  (set) => ({
    route: [],
    setRoute: (route) => set({ route }),
  })
);

export default useRoute;