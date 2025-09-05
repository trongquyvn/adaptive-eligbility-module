import React from "react";
import { NodeProps, Handle, Position } from "react-flow-renderer";

export function RoundedRectangleNode({ data }: NodeProps) {
  return (
    <div
      style={{
        width: 90,
        height: 30,
        borderRadius: 6,
        border: "black 1px solid",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: !data.message ? "black" : "var(--color-purple-600)",
        fontWeight: !data.message ? "300" : "700",
        fontSize: "6px",
        padding: "2px",
      }}
    >
      {data.label}
      {!data.message ? (
        <>
          {!data.first && (
            <Handle
              type="target"
              position={Position.Left}
              style={{ left: -3 }}
            />
          )}

          {data.yes && (
            <Handle
              type="source"
              id="yes"
              position={Position.Right}
              style={{ right: -3 }}
            />
          )}

          {data.no && (
            <Handle
              type="source"
              id="no"
              position={Position.Bottom}
              style={{ bottom: -3 }}
            />
          )}
        </>
      ) : (
        <Handle type="target" position={Position.Left} style={{ left: -3 }} />
      )}
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
