import { usePatients } from "@/context/PatientContext";
import PatientWorkflowFlow from "@/components/workflow/PatientWorkflowFlow";
import TabsMenu from "@/components/common/TabsMenu";

import { Edge, MarkerType, Node } from "react-flow-renderer";
import getLayoutElements from "@/components/workflow/elk";
import { useEffect, useState } from "react";

const renderOutcome = (data: any) => {
  return (
    <div>
      <div>{data?.outcome}</div>
      {data?.message && <div>{data.message}</div>}
    </div>
  );
};

const MyPatientWorkflowFlow = () => {
  const { rule } = usePatients();
  const flow = rule?.logic?.flow;
  const ruleNodes = rule?.logic?.nodes;
  const nodeKeys = Object.keys(ruleNodes);

  const getNodeFlow = (id: string) => flow.find((e: any) => e.id === id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rawNodes: Node[] = [];
  nodeKeys.forEach((e) => {
    const node = ruleNodes[e];
    const nodeFlow = getNodeFlow(e);
    const nodeNew = {
      id: e,
      type: "roundedRectangleNode",
      data: {
        label: node.name,
        cate: node.cate,
        first: nodeFlow?.start,
        yes: nodeFlow?.on_pass,
        no: nodeFlow?.on_fail,
      },
      position: { x: 0, y: 0 },
    };
    rawNodes.push(nodeNew);

    if (nodeFlow?.on_pass?.outcome) {
      rawNodes.push({
        id: e + "_on_pass",
        type: "roundedRectangleNode",
        data: {
          label: renderOutcome(nodeFlow?.on_pass),
          message: true,
        },
        position: { x: 0, y: 0 },
      });
    }

    if (nodeFlow?.on_fail?.outcome) {
      rawNodes.push({
        id: e + "_on_fail",
        type: "roundedRectangleNode",
        data: {
          label: renderOutcome(nodeFlow?.on_fail),
          message: true,
        },
        position: { x: 0, y: 0 },
      });
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rawEdges: Edge[] = [];
  flow.forEach((e: any, i: number) => {
    if (e?.on_fail?.outcome) {
      const edge = {
        id: "e" + i + "_fail_outcome",
        source: e.id,
        sourceHandle: "yes",
        target: e.id + "_on_fail",
        markerEnd: { type: MarkerType.Arrow },
      };

      rawEdges.push(edge);
    }

    if (e?.on_fail?.next) {
      const edge = {
        id: "e" + i + "_on_fail",
        source: e.id,
        sourceHandle: "no",
        target: e?.on_fail?.next,
        markerEnd: { type: MarkerType.Arrow },
      };

      rawEdges.push(edge);
    }

    if (e?.on_pass?.outcome) {
      const edge = {
        id: "e" + i + "_pass_outcome",
        source: e.id,
        sourceHandle: "yes",
        target: e.id + "_on_pass",
        markerEnd: { type: MarkerType.Arrow },
      };

      rawEdges.push(edge);
    }

    if (e?.on_pass?.next) {
      const edge = {
        id: "e" + i + "_on_pass",
        source: e.id,
        sourceHandle: "yes",
        target: e?.on_pass?.next,
        markerEnd: { type: MarkerType.Arrow },
      };

      rawEdges.push(edge);
    }
  });

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    getLayoutElements(rawNodes, rawEdges).then(({ nodes, edges }) => {
      setNodes(nodes);
      setEdges(edges);
    });
  }, [rawNodes, rawEdges]);

  return <PatientWorkflowFlow nodes={nodes} edges={edges} />;
};

export default function OverviewTab() {
  const { rule } = usePatients();
  const flow = rule?.logic?.flow;
  const ruleNodes = rule?.logic?.nodes;

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
          {
            id: "json",
            label: "JSON File",
            component: () => (
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-xl font-semibold">Flow</div>
                <pre>{JSON.stringify(flow, null, 2)}</pre>
                <br />
                <div className="text-xl font-semibold">Rule</div>
                <pre>{JSON.stringify(ruleNodes, null, 2)}</pre>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
