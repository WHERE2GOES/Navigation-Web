import { useEffect } from "react";
import { create } from "zustand";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const useGeneralKakaoMap = create<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: any | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMap: (map: any) => void;
}>((set) => ({
  map: undefined,
  setMap: (map) => set((state) => ({ ...state, map })),
}));

const useKakaoMap = () => {
  const { map: generalMap, setMap } = useGeneralKakaoMap();

  useEffect(() => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map");

      const options = {
        center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
        level: 5,
      };

      const newMap = new window.kakao.maps.Map(mapContainer, options);
      setMap(newMap);
    });
  }, [setMap]);

  return {
    kakao: window.kakao.maps,
    map: generalMap,
  };
};

export default useKakaoMap;
