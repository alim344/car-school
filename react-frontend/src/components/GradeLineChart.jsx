import { useMemo, useState } from "react";
import "../style/GradeLineChart.css";

export default function GradeLineChart({ grades = [], maxGrade = 5, minGrade = 1 }) {
  const [hovered, setHovered] = useState(null);

  const W = 640;
  const H = 260;
  const PAD = { top: 20, right: 24, bottom: 34, left: 40 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  
const points = useMemo(() => {
  const list = Array.isArray(grades) ? grades.filter((g) => g != null) : [];
  if (list.length === 0) return [];

  const ordered = [...list].reverse();

  const stepX = ordered.length > 1 ? innerW / (ordered.length - 1) : 0;
  const range = maxGrade - minGrade || 1;

  return ordered.map((value, i) => {
    const g = Math.max(minGrade, Math.min(maxGrade, Number(value)));
    const x = PAD.left + i * stepX;
    const y = PAD.top + innerH - ((g - minGrade) / range) * innerH;
    return { x, y, value: g, index: i };
  });
}, [grades, innerW, innerH, PAD.left, PAD.top, minGrade, maxGrade]);

  if (points.length === 0) {
    return (
      <div className="grade-line-chart__empty">
        No graded classes yet — the grade graph will appear once classes are
        evaluated.
      </div>
    );
  }

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  const areaD =
    `M ${points[0].x} ${PAD.top + innerH} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x} ${PAD.top + innerH} Z`;

  const avg = points.reduce((sum, p) => sum + p.value, 0) / points.length;
  const range = maxGrade - minGrade || 1;

  const avgColor =
    avg >= minGrade + range * 0.875
      ? "rgb(214, 251, 79)"
      : avg >= minGrade + range * 0.625
      ? "#a3e635"
      : avg >= minGrade + range * 0.375
      ? "#f59e0b"
      : "#ef4444";

  const tickValues = [];
  for (let g = minGrade; g <= maxGrade; g++) tickValues.push(g);
  const yTicks = tickValues.map((g) => ({
    g,
    y: PAD.top + innerH - ((g - minGrade) / range) * innerH,
  }));

  const showXLabels = points.length <= 12;

  return (
    <div className="grade-line-chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="grade-line-chart__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {yTicks.map(({ g, y }) => (
          <g key={g}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={y + 4}
              textAnchor="end"
              className="grade-line-chart__axis-label"
            >
              {g}
            </text>
          </g>
        ))}

        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={PAD.top + innerH - ((avg - minGrade) / range) * innerH}
          y2={PAD.top + innerH - ((avg - minGrade) / range) * innerH}
          stroke={avgColor}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.5"
        />

        <path d={areaD} fill={avgColor} opacity="0.08" />

        <path
          d={pathD}
          fill="none"
          stroke={avgColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((p) => {
          const isHovered = hovered === p.index;
          return (
            <g key={p.index}>
              <circle
                cx={p.x}
                cy={p.y}
                r="12"
                fill="transparent"
                onMouseEnter={() => setHovered(p.index)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 7 : 5}
                fill={avgColor}
                stroke="#0f172a"
                strokeWidth="2"
                style={{ transition: "r 0.15s ease" }}
                pointerEvents="none"
              />
            </g>
          );
        })}

        {showXLabels &&
          points.map((p) => (
            <text
              key={`x-${p.index}`}
              x={p.x}
              y={H - PAD.bottom + 18}
              textAnchor="middle"
              className="grade-line-chart__axis-label"
            >
              {p.index + 1}
            </text>
          ))}

        {hovered !== null && points[hovered] && (
          <g
            transform={`translate(${points[hovered].x}, ${points[hovered].y - 26})`}
            pointerEvents="none"
          >
            <rect
              x="-36"
              y="-24"
              width="72"
              height="22"
              rx="6"
              fill="#0f172a"
              stroke={avgColor}
              strokeWidth="1"
            />
            <text
              x="0"
              y="-9"
              textAnchor="middle"
              className="grade-line-chart__tooltip-text"
            >
              Class {points[hovered].index + 1}: {points[hovered].value}
            </text>
          </g>
        )}
      </svg>

      
    </div>
  );
}