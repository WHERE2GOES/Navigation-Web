import { useEffect, useState } from "react";
import useKakaoMap from "./useKakaoMap";

const usePoints = () => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const { kakao, map } = useKakaoMap();

  useEffect(() => {
    kakao.event?.addListener(map, "bounds_changed", () => {
      console.log("bounds_changed");
      setPoints((prev) => {
        return prev.map((e) => e);
      });
    });
  }, [kakao, map]);

  return {
    points,
  };
};

export default usePoints;
