export function exportJsonToFile(data: unknown, filename = "data.json") {
  const jsonStr = JSON.stringify(data, null, 2); // pretty print
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export function objExpandKeys(obj: Record<any, any>) {
  const result = {};

  for (const key in obj) {
    const parts = key.split(".");
    let current: Record<any, any> = result;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = obj[key];
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  }

  return result;
}

export function bumpVersion(version: string): string {
  const match = version.match(/^([a-zA-Z]*)(\d+)(?:\.(\d+))?$/);
  if (!match) return version;

  const prefix = match[1] || "";
  const major: any = parseInt(match[2], 10);
  const minor: any = match[3] ? parseInt(match[3], 10) : 0;

  if (minor >= 9) {
    return `${prefix}${major + 1}.0`;
  } else if (match[3]) {
    return `${prefix}${major}.${minor + 1}`;
  } else {
    return `${prefix}${major}.1`;
  }
}

type Node = any;
function collectInputVarsFromNode(
  node: Node,
  nodes: Record<string, Node>,
  acc: Set<string>
) {
  if (!node) return;

  // Nếu node có input.var
  if (node.input?.var) {
    acc.add(node.input.var);
  }

  switch (node.type) {
    case "ALL":
    case "ANY":
      if (Array.isArray(node.children)) {
        node.children.forEach((childId: string | Node) => {
          const childNode =
            typeof childId === "string" ? nodes[childId] : childId;
          collectInputVarsFromNode(childNode, nodes, acc);
        });
      }
      break;

    case "DOMAIN_MAP":
      if (Array.isArray(node.items)) {
        node.items.forEach((item: any) => {
          const child =
            typeof item.rule === "string" ? nodes[item.rule] : item.rule;
          collectInputVarsFromNode(child, nodes, acc);
        });
      }
      break;

    case "REGIMEN_RESOLVE":
      (node.constraints || []).forEach((item: any) => {
        if (item.exclude_if) {
          const excludeIf = item.exclude_if;
          const child =
            typeof excludeIf === "string" ? nodes[excludeIf] : excludeIf;
          collectInputVarsFromNode(child, nodes, acc);
        }
      });

      break;

    case "IF":
      // cond
      if (node.cond) {
        const condNode =
          typeof node.cond === "string" ? nodes[node.cond] : node.cond;
        collectInputVarsFromNode(condNode, nodes, acc);
      }
      // then
      if (node.then) {
        const thenNode =
          typeof node.then === "string" ? nodes[node.then] : node.then;
        collectInputVarsFromNode(thenNode, nodes, acc);
      }
      // else
      if (node.else) {
        const elseNode =
          typeof node.else === "string" ? nodes[node.else] : node.else;
        collectInputVarsFromNode(elseNode, nodes, acc);
      }
      break;
  }
}

export function collectInputVars(rule: any): string[] {
  const acc = new Set<string>();
  const { flow, nodes } = rule.logic;

  flow.forEach((step: any) => {
    const node = typeof step === "string" ? nodes[step] : nodes[step.id];
    collectInputVarsFromNode(node, nodes, acc);
  });

  return Array.from(acc);
}

export function getValueByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export function flattenObj(
  obj: Record<string, any>,
  parentKey = "",
  res: Record<string, any> = {}
) {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObj(value, newKey, res);
    } else {
      res[newKey] = value;
    }
  }
  return res;
}

export function isoToLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export function formatISODate(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // tháng bắt đầu từ 0
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export const statusStyle: any = {
  Eligible: "bg-green-700 text-green-700 text-white",
  Ineligible: "bg-purple-700 text-purple-700 text-white",
  Pending: "bg-purple-100 text-purple-700",
  Draft: "bg-gray-100 text-gray-600",
  Active: "bg-purple-600 text-gray-600 text-white",
};

export function canDeleteNode(ruleDoc: any, nodeId: string): boolean {
  if (!ruleDoc?.logic?.nodes || !ruleDoc?.logic?.flow) return true;

  const nodes = ruleDoc.logic.nodes;
  const visited = new Set<string>();
  const queue: string[] = [];

  for (const step of ruleDoc.logic.flow) {
    if (step.id) queue.push(step.id);
    if (step.on_pass?.next) queue.push(step.on_pass.next);
    if (step.on_fail?.next) queue.push(step.on_fail.next);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    if (current === nodeId) {
      return false;
    }

    const node = nodes[current];
    if (!node) continue;

    switch (node.type) {
      case "IF":
        [node.cond, node.then, node.else].forEach((child) => {
          if (child) queue.push(child);
        });
        break;

      case "ANY":
      case "ALL":
        node.children?.forEach((child: string) => queue.push(child));
        break;

      case "DOMAIN_MAP":
        node.items?.forEach((it: any) => {
          if (it.rule) queue.push(it.rule);
        });
        break;

      case "REGIMEN_RESOLVE":
        node.constraints?.forEach((c: any) => {
          if (c.exclude_if) queue.push(c.exclude_if);
        });
        break;

      default:
        break;
    }
  }

  return true;
}
