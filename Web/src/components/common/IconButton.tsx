import React from "react";

import "./IconButton.scss";
import svgData from "./svg-data";

const SvgItem = ({ item }: { item: any }) => {
  if (item.type === "circle") {
    return (
      <circle
        cx={item.cx}
        cy={item.cy}
        r={item.r}
        stroke={item.stroke}
        strokeWidth={item.strokeWidth}
      />
    );
  }
  if (item.type === "line") {
    return (
      <line
        x1={item.x1}
        y1={item.y1}
        x2={item.x2}
        y2={item.y2}
        stroke={item.stroke}
        strokeWidth={item.strokeWidth}
      />
    );
  }
  if (item.type === "path") {
    return (
      <path
        d={item.d}
        fill={item.fill}
        stroke={item.stroke}
        strokeWidth={item.strokeWidth}
      />
    );
  }

  return null;
};

type IProps = {
  onClick: () => void;
  icon: string | undefined;
  title?: string;
  disabled?: boolean;
};

const IconButton: React.FC<IProps> = ({
  onClick,
  icon,
  title,
  disabled,
}) => {
  if (!icon) {
    return null;
  }

  const data = svgData[icon];
  if (!data) {
    console.log("icon not found", icon);
    return null;
  }
  return (
    <div
      className={`icon-btn icon-${icon}`}
      onClick={ev => {
        if (!disabled) {
          onClick();
          ev.stopPropagation();
        }
      }}
      title={title || `# ${icon} `}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={data.viewBox || "0 0 40 40"}
        fill={data.fill}
        opacity={disabled ? 0.3 : 1}
        strokeLinejoin={data.strokeLinejoin}
        stroke={data.stroke}>
        {data.svg &&
          data.svg.map((d: any, idx: number) => (
            <SvgItem key={idx} item={d} />
          ))}
        {data.path &&
          data.path.map((p: string, idx: number) => {
            return (
              <path
                key={idx}
                d={p}
                stroke={data.stroke || "#eee"}
                fill={data.fill || "#444"}
                strokeWidth={data.strokeWidth || "2"}
              />
            );
          })}
      </svg>
    </div>
  );
};

export default IconButton;
