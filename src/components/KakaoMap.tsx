import { useEffect, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

const overlayId = "overlay";

const KakaoMap = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const kakaoMapOverlayLayer = document.querySelector(
        "#map > div:nth-child(4) > div > div:nth-child(5)"
      );

      if (kakaoMapOverlayLayer) {
        const newChild = document.createElement("div");
        newChild.id = overlayId;

        createRoot(newChild).render(children);

        const replacingChild = kakaoMapOverlayLayer.querySelector(
          `#${overlayId}`
        );

        if (replacingChild) {
          kakaoMapOverlayLayer.replaceChild(newChild, replacingChild);
        } else {
          kakaoMapOverlayLayer.appendChild(newChild);
        }

        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [children]);

  return <div className="w-full h-full" id="map" />;
};

export default KakaoMap;
