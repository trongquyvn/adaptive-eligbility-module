type RuleNode = {
  name?: string;
  cate?: string;
};

type FlowStep = {
  id: string;
  on_pass?: { next?: string; outcome?: string; message?: string };
  on_fail?: { next?: string; outcome?: string; message?: string };
};

type RuleDoc = {
  logic: {
    nodes: Record<string, RuleNode>;
    flow: FlowStep[];
  };
};

// Tự động xuống dòng nếu label dài
function wrapLabel(label: string, maxLen = 25): string {
  if (!label) return "";
  const regex = new RegExp(`(.{1,${maxLen}})(\\s+|$)`, "g");
  return label.replace(regex, "$1<br/>");
}

/**
 * Convert rule JSON → Mermaid
 * - Các cate xếp từ trên xuống (TB)
 * - Trong mỗi cate, node chạy trái → phải (LR)
 * - Chỉ render node xuất hiện trong flow
 */
export function ruleToMermaid(ruleDoc: RuleDoc): string {
  const lines: string[] = [
    '%%{ init: { "flowchart": { "curve": "step" } } }%%',
    "flowchart TB",
  ];

  // Lấy danh sách node trong flow và đếm edge vào mỗi node
  const flowNodeIds = new Set<string>();
  const targetCount: Record<string, number> = {};
  for (const step of ruleDoc.logic.flow) {
    flowNodeIds.add(step.id);
    if (step.on_pass?.next) {
      flowNodeIds.add(step.on_pass.next);
      targetCount[step.on_pass.next] =
        (targetCount[step.on_pass.next] || 0) + 1;
    }
    if (step.on_fail?.next) {
      flowNodeIds.add(step.on_fail.next);
      targetCount[step.on_fail.next] =
        (targetCount[step.on_fail.next] || 0) + 1;
    }
  }

  // Gom node theo cate
  const cateGroups: Record<string, string[]> = {};
  for (const id of flowNodeIds) {
    const node = ruleDoc.logic.nodes[id];
    if (!node) continue;
    const c = node.cate || "0";
    if (!cateGroups[c]) cateGroups[c] = [];
    const label = wrapLabel(node.name || id);
    cateGroups[c].push(`    ${id}["${label}"]`);
  }

  // Render cate theo thứ tự số, đổi Category → Page, bỏ nền
  const sortedCates = Object.keys(cateGroups).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  for (const c of sortedCates) {
    const subgraphId = `Page_${c}`;
    lines.push(`  subgraph ${subgraphId} [Page ${c}]`);
    lines.push("    direction LR");
    lines.push(...cateGroups[c]);
    lines.push("  end");
    lines.push(`  style ${subgraphId} fill:none,stroke:none;`);
  }

  // Outcome node counter
  let outcomeCount = 0;
  function outcomeNode(label: string): string {
    const id = `outcome_${++outcomeCount}`;
    const wrapped = wrapLabel(label);
    lines.push(`    ${id}("${wrapped}")`);
    lines.push(`    style ${id} rx:10, ry:10, fill:#f9f, stroke:#000;`); // bo tròn, màu tùy chỉnh
    return id;
  }

  // Fake node (hình tròn trắng)
  let fakeCount = 0;
  const usedFake: Record<string, string> = {};
  function fakeNode(target: string): string {
    if (usedFake[target]) return usedFake[target];
    const id = `fake_${++fakeCount}`;
    lines.push(`    ${id}(( ))`); // hình tròn
    lines.push(`    class ${id} fakeNodeStyle;`);
    usedFake[target] = id;
    return id;
  }

  // Thêm classDef fake node
  lines.push(`classDef fakeNodeStyle fill:#fff,stroke:#000,color:#000;`);

  // Thêm classDef cho node bắt đầu và node giữa
  lines.push(`classDef startNode fill:#fff,stroke:#0b5ed7,color:#0b5ed7;`);
  lines.push(`classDef middleNode fill:#fff,stroke:#000,color:#000;`);

  // Tạo edges
  let edgeIndex = 0;
  for (const i in ruleDoc.logic.flow) {
    const step = ruleDoc.logic.flow[i];
    const from = step.id;

    // Gán style node bắt đầu hoặc giữa
    if (i === "0") {
      lines.push(`    class ${from} startNode;`);
    } else {
      lines.push(`    class ${from} middleNode;`);
    }

    const handleEdge = (to: string, label: "yes" | "no") => {
      const color = label === "yes" ? "#0f0" : "#f00";

      if (targetCount[to] > 1) {
        const f = fakeNode(to);
        lines.push(`    ${from} -- ${label} --> ${f}`);
        lines.push(
          `    linkStyle ${edgeIndex++} stroke:${color},stroke-width:2px;`
        );
        if (!lines.includes(`    ${f} --> ${to}`)) {
          lines.push(`    ${f} --> ${to}`);
          lines.push(
            `    linkStyle ${edgeIndex++} stroke:${color},stroke-width:2px;`
          );
        }
      } else {
        lines.push(`    ${from} -- ${label} --> ${to}`);
        lines.push(
          `    linkStyle ${edgeIndex++} stroke:${color},stroke-width:2px;`
        );
      }
    };

    if (step.on_pass) {
      if (step.on_pass.next) {
        handleEdge(step.on_pass.next, "yes");
      } else if (step.on_pass.outcome) {
        const outId = outcomeNode(
          `Outcome: ${step.on_pass.outcome}${
            step.on_pass.message ? " " + step.on_pass.message : ""
          }`
        );
        lines.push(`    ${from} -- yes --> ${outId}`);
      }
    }

    if (step.on_fail) {
      if (step.on_fail.next) {
        handleEdge(step.on_fail.next, "no");
      } else if (step.on_fail.outcome) {
        const outId = outcomeNode(
          `Outcome: ${step.on_fail.outcome}${
            step.on_fail.message ? " " + step.on_fail.message : ""
          }`
        );
        lines.push(`    ${from} -- no --> ${outId}`);
      }
    }
  }

  lines.push(`classDef yesEdge stroke:#0f0,stroke-width:2px;`);
  lines.push(`classDef noEdge stroke:#f00,stroke-width:2px;`);

  return lines.join("\n");
}
