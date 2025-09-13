import { useEffect, useState, type FC } from "react";
import BorderedLine from "@/components/BorderedLine";
import useKakaoMap from "@/hooks/useKakaoMap";
import { createPortal } from "react-dom";
import useRoute from "@/hooks/useRoute";

const KakaoMap: FC = () => {
  const { kakao, map } = useKakaoMap();

  const { route } = useRoute();
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [topLeft, setTopLeft] = useState<{ top: number; left: number }>();

  useEffect(() => {
    if (!map || !kakao) return;

    const topLeft = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(
        Math.max(...route.map((p) => p.lat)),
        Math.min(...route.map((p) => p.lng))
      ),
      title: "marker-top-left",
      opacity: 0,
    });

    return () => topLeft.setMap(null);
  }, [kakao, map, route]);

  useEffect(() => {
    const calculateNewPoints = () => {
      const topLeftMarker = document
        .querySelector("[title=marker-top-left]")
        ?.closest("div");

      if (!map || !(topLeftMarker instanceof HTMLDivElement)) return;
      topLeftMarker.style.opacity = "0";

      const [top, left] = [
        topLeftMarker.style.top,
        topLeftMarker.style.left,
      ].map((style) => Number(style.slice(0, -2)));

      setTopLeft({ top, left });

      const projection = map.getProjection();
      const topLeftOfLatlngs = projection.containerPointFromCoords(
        new kakao.maps.LatLng(
          Math.max(...route.map((p) => p.lat)),
          Math.min(...route.map((p) => p.lng))
        )
      );

      const newPoints = route.map((p) => {
        const point = projection.containerPointFromCoords(
          new kakao.maps.LatLng(p.lat, p.lng)
        );

        return {
          x: point.x - topLeftOfLatlngs.x,
          y: point.y - topLeftOfLatlngs.y,
        };
      });

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
  }, [kakao, map, route]);

  const layer = document.querySelector(
    "#map > div:nth-child(1) > div > div:nth-child(6)"
  );

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full" id="map"></div>
      {layer &&
        topLeft &&
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
