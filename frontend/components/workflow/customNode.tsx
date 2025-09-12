import { cateList } from "@/constants";
import React from "react";
import { NodeProps, Handle, Position } from "reactflow";

const handleCss = {
  opacity: 0,
};

const getCateName = (id: string) => cateList.find((e) => e.id === id)?.name;

export function RoundedRectangleNode({ data }: NodeProps) {
  let customCss = {};
  if (data.message) {
    customCss = {
      border: "var(--color-purple-600) 1px solid",
      backgroundColor: "var(--color-purple-600)",
      color: "white",
      fontWeight: "700",
    };
  }

  return (
    <div
      style={{
        width: 120,
        height: 50,
        borderRadius: 6,
        border: "black 1px solid",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "black",
        fontSize: "6px",
        padding: "2px",
        ...customCss,
      }}
    >
      <div>
        <div className="font-bold text-purple-600">
          {getCateName(data.cate)}
        </div>
        <div>{data.label}</div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ left: -3, ...handleCss }}
      />

      <Handle
        type="source"
        id="yes"
        position={Position.Right}
        style={{ right: -3, ...handleCss }}
      />

      <Handle
        type="source"
        id="no"
        position={Position.Bottom}
        style={{ bottom: -3, ...handleCss }}
      />
    </div>
  );
}

export function CircleNode({ data }: NodeProps) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#9333ea",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: "bold",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      {data.label}

      <Handle
        type="source"
        position={Position.Right}
        style={{ ...handleCss }}
      />
    </div>
  );
}

export function LeftEnvelopeNode({ data }: NodeProps) {
  const width = 90;
  const height = 30;

  return (
    <svg width={width} height={height}>
      <polygon
        points={`0,0 ${width - 4},0 ${width - 4},${height} 0,${height} ${
          width / 6
        },${height / 2}`}
        fill="transparent"
        stroke="black"
        strokeWidth={1}
      />
      <foreignObject x="0" y="0" width={width} height={height}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontSize: "6px",
            overflow: "hidden",
            color: "black",
            padding: "2px 2px 2px 12px",
          }}
        >
          {data.label}

          {!data.first && (
            <Handle
              type="target"
              position={Position.Left}
              style={{ left: 10 }}
            />
          )}
          {!data.end && (
            <Handle
              type="source"
              position={Position.Right}
              style={{ right: 1 }}
            />
          )}
        </div>
      </foreignObject>
    </svg>
  );
}

export function RightEnvelopeNode({ data }: NodeProps) {
  const width = 90;
  const height = 30;

  return (
    <svg width={width} height={height}>
      <polygon
        points={`4,0 ${width - 15},0 ${width - 15},0 ${width},${height / 2} ${
          width - 15
        },${height - 2} 4,${height - 2}`}
        fill="transparent"
        stroke="black"
        strokeWidth={1}
      />

      <foreignObject x="0" y="0" width={width} height={height}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontSize: "6px",
            overflow: "hidden",
            color: "black",
            padding: "2px 12px 2px 4px",
          }}
        >
          {data.label}

          {!data.first && (
            <Handle
              type="target"
              position={Position.Left}
              style={{ left: 1 }}
            />
          )}
          {!data.end && (
            <>
              <Handle
                type="source"
                id="yes"
                position={Position.Right}
                style={{ right: -1 }}
              />
              <Handle
                type="source"
                id="no"
                position={Position.Bottom}
                style={{ bottom: -1 }}
              />
            </>
          )}
        </div>
      </foreignObject>
    </svg>
  );
}

export function DiamondNode({ data }: NodeProps) {
  const width = 50;
  const height = 50;

  return (
    <svg width={width} height={height}>
      <polygon
        points={`${width / 2},0 ${width},${height / 2} ${
          width / 2
        },${height} 0,${height / 2}`}
        fill="transparent"
        stroke="black"
        strokeWidth={1}
      />

      <foreignObject x="0" y="0" width={width} height={height}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontSize: "4px",
            overflow: "hidden",
            color: "black",
          }}
        >
          {data.label}

          <Handle type="target" position={Position.Left} style={{ left: -1 }} />
          <Handle
            type="source"
            id="yes"
            position={Position.Right}
            style={{ right: -1 }}
          />
          <Handle
            type="source"
            id="no"
            position={Position.Bottom}
            style={{ bottom: -1 }}
          />
        </div>
      </foreignObject>
    </svg>
  );
}
