import { useEffect, useMemo, useState } from "react";
import useKakaoMap from "./useKakaoMap";
import { useSearchParams } from "react-router";

const parseLatlngParam = (param: string) => {
  return param.split("n").map((e) => {
    const [lat, lng] = e.split(",");
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
      const mapLayer = document.querySelector("#map > div:nth-child(4) > div");
      if (!map || !(mapLayer instanceof HTMLElement)) return;

      const projection = map.getProjection();
      const top = Number(mapLayer.style.top.slice(0, -2));
      const left = Number(mapLayer.style.left.slice(0, -2));

      const newPoints = latlngs.map((latlng) => {
        const point = projection.containerPointFromCoords(
          new kakao.maps.LatLng(latlng.lat, latlng.lng)
        );

        return { x: point.x - left, y: point.y - top };
      });

      setPoints(newPoints);
    };

    if (map)
      kakao.maps?.event?.addListener(map, "bounds_changed", calculateNewPoints);
    return () => {
      if (map)
        kakao.maps?.event?.removeListener(
          map,
          "bounds_changed",
          calculateNewPoints
        );
    };
  }, [kakao, latlngs, map]);

  return {
    points,
  };
};

export default usePoints;
