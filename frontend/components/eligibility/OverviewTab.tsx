import { usePatients } from "@/context/PatientContext";
import PatientWorkflowFlow from "@/components/workflow/PatientWorkflowFlow";
import TabsMenu from "@/components/common/TabsMenu";

import { Edge, MarkerType, Node } from "react-flow-renderer";

// const getNode = (nodes: any, id: string) => nodes[id];

const MyPatientWorkflowFlow = () => {
  const { rule } = usePatients();
  const flow = rule?.logic?.flow;
  console.log("flow: ", flow);
  const nodes = rule?.logic?.nodes;
  const nodeKeys = Object.keys(nodes);

  const getNodeFlow = (id: string) => {
    return flow.find((e: any) => e.id === id);
  };

  const diagramNodes: Node[] = [];
  nodeKeys.forEach((e) => {
    const defaultPo = { x: 70, y: 70 };

    const getPo = (cate: any) => {
      if (!diagramNodes.length) return defaultPo;
      const nodeCates = diagramNodes.filter((e) => e.data.cate === cate);
      const x =
        defaultPo.x + nodeCates.length * 100 + nodeCates.length * defaultPo.x;
      const y = parseInt(cate) * defaultPo.y;

      return { x, y };
    };

    const position = getPo(nodes[e].cate);
    const nodeFlow = getNodeFlow(e);
    const node = {
      id: e,
      type: "roundedRectangleNode",
      data: {
        label: nodes[e].name,
        cate: nodes[e].cate,
        first: nodeFlow?.start,
        yes: nodeFlow?.on_pass,
        no: nodeFlow?.on_fail,
      },
      position,
    };
    diagramNodes.push(node);

    if (nodeFlow?.on_pass?.outcome) {
      diagramNodes.push({
        id: e + "on_pass",
        type: "roundedRectangleNode",
        data: {
          label: nodeFlow?.on_pass?.outcome,
          message: true,
        },
        position: {
          x: node.position.x + 150,
          y: node.position.y + 50,
        },
      });
    }

    if (nodeFlow?.on_fail?.outcome) {
      diagramNodes.push({
        id: e + "on_fail",
        type: "roundedRectangleNode",
        data: {
          label: nodeFlow?.on_fail?.outcome,
          message: true,
        },
        position: {
          x: node.position.x + 150,
          y: node.position.y + 50,
        },
      });
    }
  });

  const edges: Edge[] = [];
  flow.forEach((e: any, i: number) => {
    const edge = {
      id: "e" + i,
      source: e.id,
      target: e?.on_pass?.next,
      markerEnd: { type: MarkerType.Arrow },
    };

    edges.push(edge);
  });

  console.log("edges: ", edges);
  return <PatientWorkflowFlow nodes={diagramNodes} edges={edges} />;
};

export default function OverviewTab() {
  // const nodes: Node[] = [
  //   {
  //     id: "A1",
  //     type: "roundedRectangleNode",
  //     data: { label: "Patient Registration" },
  //     position: { x: 150, y: categories[0].y },
  //   },
  // ];
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

  // const edges = [
  //   { id: "e1", source: "decision", sourceHandle: "yes", target: "node2", type: "smoothstep" },
  //   { id: "e2", source: "decision", sourceHandle: "no", target: "node3", type: "smoothstep" },
  // ];

  return (
    <div className="bg-white p-5">
      <div className="flex justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold mb-2">Overview</h2>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore
          </p>
        </div>
        <div>
          <button className="px-4 py-2 rounded-lg border">Export</button>
        </div>
      </div>

      <TabsMenu
        tabs={[
          {
            id: "visual_diagram",
            label: "Visual Diagram",
            component: MyPatientWorkflowFlow,
          },
          { id: "json", label: "JSON File", component: () => <></> },
        ]}
      />
    </div>
  );
}
