import KakaoMap from "@/components/KakaoMap";
import BorderedLine from "@/components/BorderedLine";
import usePoints from "@/hooks/usePoints";

function App() {
  const { points } = usePoints();

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <KakaoMap />
      </div>
      <div className="relative">
        <BorderedLine
          points={points}
          fillColor={["#FFB76A", "#FF6A6A"]}
          borderColor="#404040"
          thickness={15}
          borderThickness={1}
        />
      </div>
    </div>
  );
}

export default App;
