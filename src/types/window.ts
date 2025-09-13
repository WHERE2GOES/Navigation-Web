declare global {
  interface Window {
    isKakaoMapInitialized: boolean;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;

    /** 지도를 지정 위치로 이동 */
    panMapTo?: (lat: number, lng: number) => void;

    /** 사용자의 현재 위치를 업데이트 */
    updateMyLocation?: (lat: number, lng: number) => void;

    /** 지도에 마커를 표시 */
    markMap?: (lat: number, lng: number, onClick?: () => void) => void;

    /** 지도에 경로를 표시 */
    markRoute?: (positions: { lat: number; lng: number; }[]) => void;

    /** 지도의 모든 마커를 제거 */
    clearMap?: () => void;
  }
}
