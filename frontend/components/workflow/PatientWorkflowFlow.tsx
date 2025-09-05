"use client";

import React from "react";
import ReactFlow, {
  // Background,
  // Controls,
  // MiniMap,
  Node,
  Edge,
  // MarkerType,
} from "react-flow-renderer";
import {
  RoundedRectangleNode,
  LeftEnvelopeNode,
  RightEnvelopeNode,
  DiamondNode,
} from "./customNode";

const nodeTypes = {
  roundedRectangleNode: RoundedRectangleNode,
  leftEnvelopeNode: LeftEnvelopeNode,
  rightEnvelopeNode: RightEnvelopeNode,
  diamondNode: DiamondNode,
};

export default function PatientWorkflowFlow({ nodes, edges }: { nodes: Node[], edges: Edge[] }) {
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
    <div className="flex-1 border h-[500px] overflow-auto bg-white">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        fitView
        zoomOnScroll={false}
      >
        {/* <Background /> */}
        {/* <MiniMap /> */}
        {/* <Controls /> */}
      </ReactFlow>
    </div>
  );
}
