import { useId, type CSSProperties, type FC } from "react"; // useId 훅을 import 합니다.

const BorderedLine: FC<{
  points: { x: number; y: number }[];
  fillColor: string | string[];
  borderColor: CSSProperties["color"];
  thickness: number;
  borderThickness: number;
}> = (prop) => {
  // 컴포넌트마다 고유한 ID를 생성해 그라데이션이 겹치지 않도록 합니다.
  const gradientId = useId();

  // fillColor가 배열이면 그라데이션으로 간주합니다.
  const isGradient =
    Array.isArray(prop.fillColor) && prop.fillColor.length >= 2;

  const polylinePoints = prop.points.map((p) => `${p.x},${p.y}`).join(" ");
  const innerThickness = prop.thickness - prop.borderThickness * 2;

  // 그라데이션의 시작점과 끝점을 전체 폴리라인의 시작/끝점으로 설정합니다.
  const startPoint = prop.points[0];
  const endPoint = prop.points[prop.points.length - 1];

  return (
    prop.points.length > 1 && (
      <svg className="overflow-visible w-[1px] h-[1px]">
        <defs>
          {isGradient && (
            <linearGradient
              id={gradientId}
              x1={startPoint.x}
              y1={startPoint.y}
              x2={endPoint.x}
              y2={endPoint.y}
              gradientUnits="userSpaceOnUse" // 좌표를 절대단위로 사용
            >
              <stop offset="0%" stopColor={prop.fillColor[0]} />
              <stop offset="100%" stopColor={prop.fillColor[1]} />
            </linearGradient>
          )}
        </defs>
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={prop.borderColor}
          strokeWidth={prop.thickness}
          strokeLinecap="round"
          strokeLinejoin="round"
          shapeRendering="crispEdges"
          className="pointer-events-none"
        />
        {innerThickness > 0 && (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke={
              isGradient
                ? `url(#${gradientId})`
                : typeof prop.fillColor === "string"
                ? prop.fillColor
                : prop.fillColor[0]
            }
            strokeWidth={innerThickness}
            strokeLinecap="round"
            strokeLinejoin="round"
            shapeRendering="crispEdges"
            className="pointer-events-none"
          />
        )}
      </svg>
    )
  );
};

export default BorderedLine;
