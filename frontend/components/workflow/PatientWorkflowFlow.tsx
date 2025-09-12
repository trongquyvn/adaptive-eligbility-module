"use client";

import React, { useState } from "react";
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
  CircleNode,
} from "./customNode";
import "reactflow/dist/style.css";
import NodePopup from "./NodePopup";

const nodeTypes = {
  roundedRectangleNode: RoundedRectangleNode,
  leftEnvelopeNode: LeftEnvelopeNode,
  rightEnvelopeNode: RightEnvelopeNode,
  diamondNode: DiamondNode,
  circleNode: CircleNode,
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
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (node?.data?.message) return;
    setSelectedNodeId(node.id);
    setOpen(true);
  };

  return (
    <>
      <NodePopup
        nodeId={selectedNodeId}
        open={open}
        onClose={() => setOpen(false)}
      />

      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        edgeTypes={edgeTypes}
        fitView
        zoomOnScroll={false}
        onNodeClick={handleNodeClick}
      >
        {/* <Background /> */}
        {/* <MiniMap /> */}
        <Controls />
      </ReactFlow>
    </>
  );
}
