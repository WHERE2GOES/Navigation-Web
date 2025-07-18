import { useEffect, useMemo, useState } from "react";
import useKakaoMap from "./useKakaoMap";
import { useSearchParams } from "react-router";

const parseLatlngParam = (param: string) => {
  return param.split("n").map((e) => {
    const [lat, lng] = e.split(",");
    console.log(lat, lng);
    return { lat: Number(lat), lng: Number(lng) };
  });
};

const usePoints = () => {
  const [params] = useSearchParams();
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const { kakao, map } = useKakaoMap();

  const latlngs = useMemo(() => {
    const latlngParam = params.get("latlngs");
    const latlngs = latlngParam ? parseLatlngParam(latlngParam) : [];
    return latlngs;
  }, [params]);

  useEffect(() => {
    const calculateNewPoints = () => {
      if (!map) return;
      const projection = map.getProjection();

      const newPoints = latlngs.map((latlng) => {
        const point = projection.containerPointFromCoords(
          new kakao.maps.LatLng(latlng.lat, latlng.lng)
        );
        return { x: point.x, y: point.y };
      });

      setPoints(newPoints);
    };

    kakao.maps.event?.addListener(map, "bounds_changed", calculateNewPoints);
    return () => {
      try {
        kakao.maps.event?.removeListener(map, "bounds_changed", calculateNewPoints);
      } catch (error) {
        console.error(error);
      }
    };
  }, [kakao, latlngs, map]);

  return {
    points,
  };
};

export default usePoints;
