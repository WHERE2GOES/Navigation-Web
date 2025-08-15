import { useMemo } from "react";
import { useSearchParams } from "react-router";

const parseLatlngParam = (param: string) => {
  return param.split("n").map((e) => {
    const [lat, lng] = e.split(",");
    return { lat: Number(lat), lng: Number(lng) };
  });
};

const useLatlngs = () => {
  const [params] = useSearchParams();

  const latlngs = useMemo(() => {
    const latlngParam = params.get("latlngs");
    const latlngs = latlngParam ? parseLatlngParam(latlngParam) : [];
    return latlngs;
  }, [params]);

  return latlngs;
};

export default useLatlngs;
