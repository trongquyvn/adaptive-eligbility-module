const { applyOverrides } = require("./applyOverrides");
const { patientExists } = require("../database");

function getValueByPath(obj, path) {
  if (!path) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

// ------------------ RESOLVE VARIABLE ------------------
function resolveVariable(varDef, patientData, nodeType) {
  if (!varDef || !varDef.var) {
    return { value: null, id: null };
  }

  const rawValue = getValueByPath(patientData.data, varDef.var);

  if (rawValue === undefined || rawValue === null) {
    return { value: null, id: varDef.var };
  }

  switch (nodeType) {
    case "BOOLEAN":
    case "DATABASE":
    case "NOT":
      let val;
      if (typeof rawValue === "string") {
        val = rawValue.toLowerCase() === "true";
      } else {
        val = Boolean(rawValue);
      }
      return { value: val, id: varDef.var };

    case "COMPARE":
      return { value: Number(rawValue), id: varDef.var };

    case "TIME_WINDOW":
      return { value: new Date(rawValue), id: varDef.var };

    default:
      return { value: rawValue, id: varDef.var };
  }
}

// ------------------ EVALUATE NODE ------------------
function evaluateNode(node, patientData, ruleDoc, ctx, shouldAddError = true) {
  if (!node) return true;
  const t = node.type;

  const fail = (reason) => {
    if (reason && shouldAddError) ctx.key_reasons.push(reason);
    return false;
  };
  const pending = (id) => {
    ctx.hasPending = true;
    ctx.data_needed.push(id);
    return true;
  };

  if (t === "CONST_BOOL") {
    return node.value ? true : fail(node.reason_on_fail);
  }

  if (t === "COMPARE") {
    const { value: left, id } = resolveVariable(
      node.input,
      patientData,
      node.type
    );
    if (left === null) {
      return node.allow_unknown ? pending(id) : fail(node.reason_on_fail);
    }
    const right = node.right.const;
    let result = false;
    switch (node.operator) {
      case "<":
        result = left < right;
        break;
      case ">":
        result = left > right;
        break;
      case "<=":
        result = left <= right;
        break;
      case ">=":
        result = left >= right;
        break;
      case "==":
        result = left == right;
        break;
      case "!=":
        result = left != right;
        break;
    }
    return result ? true : fail(node.reason_on_fail);
  }

  if (t === "BOOLEAN" || t === "DATABASE") {
    const { value, id } = resolveVariable(node.input, patientData, node.type);
    console.log("id: ", id);
    console.log("value: ", value);
    if (value === null) {
      return node.allow_unknown ? pending(id) : fail(node.reason_on_fail);
    }
    return value ? true : fail(node.reason_on_fail);
  }

  if (t === "NOT") {
    const { value, id } = resolveVariable(node.input, patientData, node.type);
    if (value === null) {
      return node.allow_unknown ? pending(id) : fail(node.reason_on_fail);
    }
    return !value ? true : fail(node.reason_on_fail);
  }

  if (t === "ALL") {
    let allPass = true;
    for (const child of node.children) {
      const res =
        typeof child === "string"
          ? evaluateNode(ruleDoc.logic.nodes[child], patientData, ruleDoc, ctx)
          : evaluateNode(child, patientData, ruleDoc, ctx);
      if (!res) allPass = false;
    }
    return allPass ? true : fail(node.reason_on_fail);
  }

  if (t === "ANY") {
    let anyPass = false;
    for (const child of node.children) {
      const res =
        typeof child === "string"
          ? evaluateNode(ruleDoc.logic.nodes[child], patientData, ruleDoc, ctx)
          : evaluateNode(child, patientData, ruleDoc, ctx);
      if (res) anyPass = true;
    }
    return anyPass ? true : fail(node.reason_on_fail);
  }

  if (t === "TIME_WINDOW") {
    const now = new Date(patientData.now || Date.now());
    const { value: left, id } = resolveVariable(
      node.input,
      patientData,
      node.type
    );

    if (left === null) {
      return node.allow_unknown ? pending(id) : fail(node.reason_on_fail);
    }
    const diffHours = Math.abs((now - left) / (1000 * 60 * 60));
    let ok = true;

    if (node.window.max_hours_since !== undefined) {
      ok = ok && diffHours >= node.window.max_hours_since;
    }
    if (node.window.min_hours_since !== undefined) {
      ok = ok && diffHours <= node.window.min_hours_since;
    }

    return ok ? true : fail(node.reason_on_fail);
  }

  if (t === "IF") {
    const condNode =
      typeof node.cond === "string"
        ? ruleDoc.logic.nodes[node.cond]
        : node.cond;
    const thenNode =
      typeof node.then === "string"
        ? ruleDoc.logic.nodes[node.then]
        : node.then;
    const elseNode =
      typeof node.else === "string"
        ? ruleDoc.logic.nodes[node.else]
        : node.else;

    const cond = evaluateNode(condNode, patientData, ruleDoc, ctx);
    return cond
      ? evaluateNode(thenNode, patientData, ruleDoc, ctx)
      : evaluateNode(elseNode, patientData, ruleDoc, ctx);
  }

  if (t === "DOMAIN_MAP") {
    if (!ctx.eligible_domains) ctx.eligible_domains = [];
    for (const item of node.items) {
      const ruleNode =
        typeof item.rule === "string"
          ? ruleDoc.logic.nodes[item.rule]
          : item.rule;

      const res = evaluateNode(ruleNode, patientData, ruleDoc, ctx);
      if (res) {
        ctx.eligible_domains.push(item.domain_id);
      }
    }
    return true;
  }

  if (t === "REGIMEN_RESOLVE") {
    if (!ctx.eligible_regimens) ctx.eligible_regimens = [];

    // Step 1: collect previously resolved eligible domains
    const eligibleDomains = ctx.eligible_domains || [];

    // Step 2: get all regimens that belong to eligible domains
    let regimens = (ruleDoc.regimen_catalog || []).filter((r) =>
      eligibleDomains.includes(r.domain_id)
    );

    // Step 3: apply constraints
    if (node.constraints) {
      for (const constraint of node.constraints) {
        regimens = regimens.filter((reg) => {
          if (reg.id !== constraint.regimen_id) return true;

          const excludeNode =
            typeof constraint.exclude_if === "string"
              ? ruleDoc.logic.nodes[constraint.exclude_if]
              : constraint.exclude_if;

          const excluded = evaluateNode(
            excludeNode,
            patientData,
            ruleDoc,
            ctx,
            false
          );

          if (excluded) {
            if (constraint.reason_on_exclude) {
              ctx.key_reasons.push(constraint.reason_on_exclude);
            }
            return false;
          }
          return true;
        });
      }
    }

    // Step 4: check if minimum required regimens are available
    if (regimens.length >= (node.require_min_regimens || 1)) {
      ctx.eligible_regimens = regimens.map((r) => r.id);
      return true;
    }

    return fail(node.reason_on_fail);
  }

  return false;
}

// ------------------ ROOT MODE ------------------
function evaluateByRoot(patientData, ruleDoc) {
  const ctx = { key_reasons: [], data_needed: [], hasPending: false };
  const result = evaluateNode(
    ruleDoc.logic.nodes[ruleDoc.logic.root],
    patientData,
    ruleDoc,
    ctx
  );

  return {
    status: ctx.hasPending ? "Pending" : result ? "Eligible" : "Not Eligible",
    key_reasons: ctx.key_reasons,
    eligible_domains: ctx.eligible_domains || [],
    eligible_regimens: ctx.eligible_regimens || [],
    data_needed: ctx.hasPending ? ctx.data_needed : [],
  };
}

// ------------------ FLOW MODE ------------------
function evaluateByFlow(patientData, ruleDoc) {
  const ctx = { key_reasons: [], data_needed: [], hasPending: false };
  let currentStep = ruleDoc.logic.flow[0];
  let finalOutcome = null;
  let finalCode = null;

  const maxStep = ruleDoc.logic.flow.length;
  let count = 0;
  let cate = "1";
  let isOnPass = true;
  while (currentStep && !finalOutcome) {
    count++;
    const node = ruleDoc.logic.nodes[currentStep.id];
    cate = node?.cate;
    const result = evaluateNode(node, patientData, ruleDoc, ctx);
    const branch = result ? currentStep.on_pass : currentStep.on_fail;

    if (branch) {
      if (branch.next) {
        currentStep = ruleDoc.logic.flow.find((f) => f.id === branch.next);
      } else if (branch.outcome) {
        if (!result) isOnPass = false;
        finalOutcome = branch.outcome;
        finalCode = branch.code || null;
      } else {
        if (!result) isOnPass = false;
        break;
      }
    } else {
      if (!result) isOnPass = false;
      break;
    }
  }

  return {
    status: ctx.hasPending ? "Pending" : finalOutcome || "Unknown",
    registry_code: finalCode,
    eligible_domains: ctx.eligible_domains || [],
    eligible_regimens: ctx.eligible_regimens || [],
    key_reasons: ctx.key_reasons,
    data_needed: ctx.hasPending ? ctx.data_needed : [],
    done: count === maxStep,
    cate,
    isOnPass,
  };
}

// ------------------ ENTRY POINT ------------------
async function evaluate(patientData, ruleDoc, mode = "flow") {
  const workingRule = applyOverrides(ruleDoc, patientData);

  const hasDatabaseNode = Object.values(workingRule.logic.nodes).some(
    (node) => node.type === "DATABASE"
  );

  if (hasDatabaseNode) {
    const exists = await patientExists(patientData.patient_id);
    patientData.data.database = exists;
  }

  const coreResult =
    mode === "flow"
      ? evaluateByFlow(patientData, workingRule)
      : evaluateByRoot(patientData, workingRule);

  return {
    ...coreResult,
    evaluated_at: new Date().toISOString(),
    rules_version: ruleDoc.trial.version,
  };
}

module.exports = { evaluate, applyOverrides };
