import { useRef, useEffect } from "react";
import useKakaoMap from "@/hooks/useKakaoMap.ts";

const KakaoMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useKakaoMap();

  useEffect(() => {
    map.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
        level: 5,
      };

      new window.kakao.maps.Map(mapContainer.current, options);
    });
  }, [map]);

  return <div className="w-full h-full" ref={mapContainer} />;
};

export default KakaoMap;
