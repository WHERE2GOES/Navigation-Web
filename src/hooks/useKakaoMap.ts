import { useEffect, useRef, useState } from "react";
import { create } from "zustand";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;

    /** 지도를 지정 위치로 이동 */
    panMapTo?: (lat: number, lng: number) => void;

    /** 사용자의 현재 위치를 업데이트 */
    updateMyLocation?: (lat: number, lng: number) => void;

    /** 지도에 마커를 표시 */
    markMap?: (
      lat: number,
      lng: number,
      onClick?: () => void
    ) => void;

    /** 지도의 모든 마커를 제거 */
    clearMap?: () => void;
  }
}

const useGeneralKakaoMap = create<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMap: (map: any) => void;
}>((set) => ({
  map: undefined,
  setMap: (map) => set((state) => ({ ...state, map })),
}));

const useKakaoMap = () => {
  const { map: generalMap, setMap } = useGeneralKakaoMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [locationMarker, setLocationMarker] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markers = useRef<any[]>([]);

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

  useEffect(() => {
    const panMapTo = (lat: number, lng: number) => {
      const latlng = new window.kakao.maps.LatLng(lat, lng);
      generalMap?.panTo(latlng);
    };

    const updateMyLocation = (lat: number, lng: number) => {
      const latlng = new window.kakao.maps.LatLng(lat, lng);

      if (!locationMarker) {
        const imageSrc = "/images/ic_human.svg";
        const imageSize = new window.kakao.maps.Size(23.85, 34.15);
        const imageOption = { offset: new window.kakao.maps.Point(11.92, 25) };
        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );
        const newMarker = new window.kakao.maps.Marker({
          position: latlng,
          image: markerImage,
        });
        newMarker.setMap(generalMap);
        setLocationMarker(newMarker);
      } else {
        locationMarker.setPosition(latlng);
      }
    };

    const markMap = (
      lat: number,
      lng: number,
      onClick?: () => void
    ) => {
      const latlng = new window.kakao.maps.LatLng(lat, lng);
      const imageSrc = "/images/ic_marker.svg";
      const imageSize = new window.kakao.maps.Size(61.88, 48.61);
      const imageOption = { offset: new window.kakao.maps.Point(30.94, 41) };
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      const newMarker = new window.kakao.maps.Marker({
        position: latlng,
        image: markerImage,
      });
      newMarker.setMap(generalMap);
      if (onClick) newMarker.addListener("click", onClick);
      markers.current.push(newMarker);
    };

    const clearMap = () => {
      markers.current.forEach((marker) => marker.setMap(null));
      markers.current = [];
    };

    window.panMapTo = panMapTo;
    window.updateMyLocation = updateMyLocation;
    window.markMap = markMap;
    window.clearMap = clearMap;
    return () => {
      window.panMapTo = undefined;
      window.updateMyLocation = undefined;
      window.markMap = undefined;
      window.clearMap = undefined;
    };
  }, [generalMap, locationMarker]);

  return {
    kakao: window.kakao,
    map: generalMap,
  };
};

export default useKakaoMap;
