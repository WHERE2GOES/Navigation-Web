import { useEffect, useRef, useState } from "react";
import useRoute from "./useRoute";

window.isKakaoMapInitialized = false;

const useKakaoMap = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [locationMarker, setLocationMarker] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markers = useRef<any[]>([]);
  const { setRoute } = useRoute();

  // 카카오맵 SDK 로딩
  useEffect(() => {
    if (window.isKakaoMapInitialized) return;
    window.isKakaoMapInitialized = true;

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

  // 전역 함수 선언
  useEffect(() => {
    const panMapTo = (lat: number, lng: number) => {
      const latlng = new window.kakao.maps.LatLng(lat, lng);
      map?.panTo(latlng);
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

        newMarker.setMap(map);
        setLocationMarker(newMarker);
      } else {
        locationMarker.setPosition(latlng);
      }
    };

    const markMap = (lat: number, lng: number, onClick?: () => void) => {
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

      newMarker.setMap(map);
      if (onClick) newMarker.addListener("click", onClick);
      markers.current.push(newMarker);
    };

    const markRoute = (positions: { lat: number; lng: number }[]) => {
      setRoute(positions);
    };

    const clearMap = () => {
      markers.current.forEach((marker) => marker.setMap(null));
      markers.current = [];
    };

    window.panMapTo = panMapTo;
    window.updateMyLocation = updateMyLocation;
    window.markMap = markMap;
    window.markRoute = markRoute;
    window.clearMap = clearMap;

    return () => {
      window.panMapTo = undefined;
      window.updateMyLocation = undefined;
      window.markMap = undefined;
      window.markRoute = undefined;
      window.clearMap = undefined;
    };
  }, [map, locationMarker, setRoute]);

  return {
    kakao: window.kakao,
    map,
  };
};

export default useKakaoMap;
