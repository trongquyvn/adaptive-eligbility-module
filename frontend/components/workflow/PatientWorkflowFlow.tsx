"use client";

import React from "react";
import ReactFlow, {
  Node,
  Controls,
  Edge,
  EdgeProps,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
} from "reactflow";
import {
  RoundedRectangleNode,
  LeftEnvelopeNode,
  RightEnvelopeNode,
  DiamondNode,
} from "./customNode";
import "reactflow/dist/style.css";

const nodeTypes = {
  roundedRectangleNode: RoundedRectangleNode,
  leftEnvelopeNode: LeftEnvelopeNode,
  rightEnvelopeNode: RightEnvelopeNode,
  diamondNode: DiamondNode,
};

function CustomEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
    style = {},
    markerEnd,
  } = props;
  let customStyle = {};
  const isPass = id.includes("on_pass");
  if (isPass) {
    customStyle = { stroke: "green" };
  }
  const isFail = id.includes("on_fail");
  if (isFail) {
    customStyle = { stroke: "red" };
  }

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, ...customStyle }}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 8,
              background: "white",
              padding: "1px",
              borderRadius: "4px",
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const edgeTypes = { custom: CustomEdge };

export default function PatientWorkflowFlow({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: Edge[];
}) {
  // Category info: name + vertical y position
  // const categories = [
  //   { id: "cat1", label: "Category 1", y: 50 },
  //   { id: "cat2", label: "Category 2", y: 150 },
  //   { id: "cat3", label: "Category 3", y: 250 },
  //   { id: "cat4", label: "Category 4", y: 350 },
  // ];

  // Nodes: x = horizontal position, y = category.y
  // const nodes: Node[] = [
  //   {
  //     id: "A1",
  //     type: "roundedRectangleNode",
  //     data: { label: "Patient Registration" },
  //     position: { x: 150, y: categories[0].y },
  //   },
  //   {
  //     id: "B1",
  //     type: "leftEnvelopeNode",
  //     data: { label: "Check if patient exists" },
  //     position: { x: 300, y: categories[0].y },
  //   },
  // ];

  // Edges: connect nodes
  // const edges: Edge[] = [
  // {
  //   id: "e1",
  //   source: "A1",
  //   target: "B1",
  //   markerEnd: { type: MarkerType.Arrow },
  // },
  // {
  //   id: "e2",
  //   source: "B1",
  //   target: "C1",
  //   markerEnd: { type: MarkerType.Arrow },
  // },
  // ];

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      edgeTypes={edgeTypes}
      fitView
      zoomOnScroll={false}
    >
      {/* <Background /> */}
      {/* <MiniMap /> */}
      <Controls />
    </ReactFlow>
  );
}
