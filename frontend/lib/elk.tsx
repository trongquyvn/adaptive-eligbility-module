"use client";

import { Node, Edge } from "reactflow";
import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const elkOptions = {
  layoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.spacing.nodeNode": "20",
    "elk.layered.spacing.nodeNodeBetweenLayers": "20",
    "elk.layered.wrapping.strategy": "MULTI_EDGE",
    "elk.layered.nodePlacement.favorStraightEdges": "true",
  },
};

export default async function getLayoutElements(
  nodes: Node[],
  edges: Edge[]
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const graph = {
    id: "root",
    layoutOptions: elkOptions.layoutOptions,
    children: nodes.map((node) => ({
      id: node.id,
      width: 120,
      height: 50,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layout = await elk.layout(graph);

  const layoutNodes = nodes.map((node) => {
    const layoutNode = layout.children?.find((n) => n.id === node.id);
    return {
      ...node,
      position: {
        x: layoutNode?.x || 0,
        y: layoutNode?.y || 0,
      },
    };
  });

  return { nodes: layoutNodes, edges };
}
