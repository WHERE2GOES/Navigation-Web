import { useEffect, useState, type FC } from "react";
import BorderedLine from "@/components/BorderedLine";
import useKakaoMap from "@/hooks/useKakaoMap";
import { createPortal } from "react-dom";

export type Latlngs = { lat: number; lng: number }[];

const KakaoMap: FC<{ latlngs: Latlngs }> = ({ latlngs }) => {
  const { kakao, map } = useKakaoMap();

  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [topLeft, setTopLeft] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (!map || !kakao) return;

    const topLeft = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(
        Math.max(...latlngs.map((latlng) => latlng.lat)),
        Math.min(...latlngs.map((latlng) => latlng.lng))
      ),
      title: "marker-top-left",
    });

    return () => topLeft.setMap(null);
  }, [kakao, map, latlngs]);

  useEffect(() => {
    const calculateNewPoints = () => {
      const topLeft = document
        .querySelector("[title=marker-top-left]")
        ?.closest("div");

      if (!map || !(topLeft instanceof HTMLDivElement)) return;

      const projection = map.getProjection();

      const top = Number(topLeft.style.top.slice(0, -2));
      const left = Number(topLeft.style.left.slice(0, -2));
      setTopLeft({ top, left });

      const topLeftOfLatlngs = projection.containerPointFromCoords(
        new kakao.maps.LatLng(
          Math.max(...latlngs.map((latlng) => latlng.lat)),
          Math.min(...latlngs.map((latlng) => latlng.lng))
        )
      );

      const newPoints = latlngs.map((latlng) => {
        const point = projection.containerPointFromCoords(
          new kakao.maps.LatLng(latlng.lat, latlng.lng)
        );

        return {
          x: point.x - topLeftOfLatlngs.x,
          y: point.y - topLeftOfLatlngs.y,
        };
      });

      console.log(newPoints);
      setPoints(newPoints);
    };

    if (map)
      kakao.maps?.event?.addListener(map, "zoom_changed", calculateNewPoints);
    return () => {
      if (map)
        kakao.maps?.event?.removeListener(
          map,
          "zoom_changed",
          calculateNewPoints
        );
    };
  }, [kakao, map, latlngs]);

  const layer = document.querySelector(
    "#map > div:nth-child(1) > div > div:nth-child(6)"
  );

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full" id="map"></div>
      {layer &&
        createPortal(
          <div
            className="absolute z-0"
            style={{
              top: topLeft.top,
              left: topLeft.left,
            }}
          >
            <BorderedLine
              points={points}
              fillColor={["#FFB76A", "#FF6A6A"]}
              borderColor="#404040"
              thickness={15}
              borderThickness={1}
            />
          </div>,
          layer
        )}
    </div>
  );
};

export default KakaoMap;
