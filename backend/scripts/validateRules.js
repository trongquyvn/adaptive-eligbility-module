// scripts/validateRules.js
const fs = require("fs");
const path = require("path");

function loadJson(filePath) {
  const raw = fs.readFileSync(path.resolve(filePath), "utf-8");
  return JSON.parse(raw);
}

function validateRule(rule, filename) {
  const errors = [];

  const nodeIds = rule.logic && rule.logic.nodes ? Object.keys(rule.logic.nodes) : [];
  const varIds = rule.variables ? rule.variables.map(v => v.id) : [];

  // check flow steps
  const flow = rule.logic && Array.isArray(rule.logic.flow) ? rule.logic.flow : [];
  flow.forEach(step => {
    if (step.id && !nodeIds.includes(step.id)) {
      errors.push(`Flow step '${step.id}' is not defined in nodes`);
    }
    if (step.next && !nodeIds.includes(step.next)) {
      errors.push(`Flow step '${step.id}' references next='${step.next}' but this node does not exist`);
    }
  });

  // recursive checker for vars, children, and map items
  function checkObj(obj, nodeId) {
    if (typeof obj !== "object" || obj === null) return;

    if (obj.var && !varIds.includes(obj.var)) {
      errors.push(`Node '${nodeId}' references var='${obj.var}' but it is not defined in variables`);
    }

    if (Array.isArray(obj.children)) {
      obj.children.forEach(childId => {
        if (!nodeIds.includes(childId)) {
          errors.push(`Node '${nodeId}' references child='${childId}' but this node does not exist`);
        }
      });
    }

    if (obj.type === "MAP" && Array.isArray(obj.items)) {
      obj.items.forEach(item => {
        if (item.rule) {
          checkObj(item.rule, nodeId);
        }
      });
    }

    Object.values(obj).forEach(v => {
      if (typeof v === "object") checkObj(v, nodeId);
    });
  }

  nodeIds.forEach(nodeId => {
    const node = rule.logic.nodes[nodeId];
    checkObj(node, nodeId);
  });

  if (errors.length === 0) {
    console.log(`✅ Rule in ${filename} OK`);
  } else {
    console.log(`❌ Rule in ${filename} has errors:`);
    errors.forEach(e => console.log("   - " + e));
  }
}

// entry point
const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node scripts/validateRules.js <path-to-json>");
  process.exit(1);
}

const data = loadJson(filePath);

if (Array.isArray(data)) {
  data.forEach((rule, i) => validateRule(rule, `${filePath}[${i}]`));
} else {
  validateRule(data, filePath);
}
