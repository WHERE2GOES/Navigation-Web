import KakaoMap from "@/components/KakaoMap";

function App() {
  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <KakaoMap />
      </div>
      <div className="relative"><h1>hello</h1></div>
    </div>
  );
}

export default App;
