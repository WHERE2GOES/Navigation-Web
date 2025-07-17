declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const useKakaoMap = () => {
  return window.kakao.maps;
};

export default useKakaoMap;
