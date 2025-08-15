import KakaoMap from "@/components/KakaoMap";
import useLatlngs from "@/hooks/useLatlngs";

const NavigationPage = () => {
  const latlngs = useLatlngs();

  return (
    <div className="w-screen h-screen">
      <KakaoMap latlngs={latlngs} />
    </div>
  );
};

export default NavigationPage;
