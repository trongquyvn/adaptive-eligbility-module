"use client";

import { useEffect, useState } from "react";
import TagInput from "@/components/common/TagInput";
import { cateList } from "@/constants";
import { objExpandKeys } from "@/lib/common";
import { useToast } from "@/context/ToastContext";
import { usePatients } from "@/context/PatientContext";
import { updateRule } from "@/lib/rule";

type NodeType = string;

interface CreateNodeProps {
  nodes: string[];
  domainNodes: string[];
  domains: string[];
  regimens: string[];
  variables: string[];
  initForm?: Record<string, any>;
  initType?: NodeType;
  onClose: () => void;
}

const NODE_FIELDS: Record<
  NodeType,
  {
    key: string;
    label: string;
    type: string;
    default?: any;
    optional?: boolean;
  }[]
> = {
  BOOLEAN: [
    { key: "input.var", label: "Variable", type: "text" },
    { key: "reason_on_fail", label: "Reason on Fail", type: "text" },
  ],
  COMPARE: [
    { key: "input.var", label: "Variable", type: "text" },
    {
      key: "operator",
      label: "Operator (<, >, <=, >=, ==, !=)",
      type: "operator",
    },
    { key: "right.const", label: "Right Const", type: "number" },
    { key: "reason_on_fail", label: "Reason on Fail", type: "text" },
  ],
  TIME_WINDOW: [
    { key: "input.var", label: "Variable", type: "text" },
    {
      key: "window.max_hours_since",
      label: "Max Hours",
      type: "number",
      optional: true,
    },
    {
      key: "window.min_hours_since",
      label: "Min Hours",
      type: "number",
      optional: true,
    },
    { key: "reason_on_fail", label: "Reason on Fail", type: "text" },
  ],
  NOT: [
    { key: "input.var", label: "Variable", type: "text" },
    { key: "reason_on_fail", label: "Reason on Fail", type: "text" },
  ],
  ANY: [], // custom multi-select
  ALL: [], // custom multi-select
  IF: [],
  DOMAIN_MAP: [],
  REGIMEN_RESOLVE: [
    {
      key: "require_min_regimens",
      label: "Require Min Regimens",
      type: "number",
    },
    { key: "reason_on_fail", label: "Reason on Fail", type: "text" },
  ],
  DATA: [
    { key: "input.var", label: "Variable", type: "text" },
    { key: "right.const", label: "Right Const", type: "text" },
    { key: "reason_on_fail", label: "Reason on Fail", type: "text" },
  ],
};

export default function CreateNode({
  nodes,
  domainNodes,
  domains,
  regimens,
  variables,
  initForm,
  initType,
  onClose,
}: CreateNodeProps) {
  const [open, setOpen] = useState(false);
  const [nodeType, setNodeType] = useState<NodeType | "">(initType || "");
  const [form, setForm] = useState<Record<string, any>>(
    initForm || { cate: "1" }
  );
  const [domainItems, setDomainItems] = useState<
    { domain_id: string; rule: string }[]
  >(initForm?.items || [{ domain_id: domains[0] || "", rule: nodes[0] || "" }]);
  const [constraints, setConstraints] = useState<
    { regimen_id: string; exclude_if: string; reason_on_exclude: string }[]
  >(
    initForm?.constraints || [
      {
        regimen_id: regimens[0] || "",
        exclude_if: nodes[0] || "",
        reason_on_exclude: "",
      },
    ]
  );

  useEffect(() => {
    if (initType) {
      if (initForm && Object.keys(initForm).length) {
        setForm(initForm);
        setDomainItems(
          initForm?.items || [
            { domain_id: domains[0] || "", rule: nodes[0] || "" },
          ]
        );
        setConstraints(
          initForm?.constraints || [
            {
              regimen_id: regimens[0] || "",
              exclude_if: nodes[0] || "",
              reason_on_exclude: "",
            },
          ]
        );
      }
      setNodeType(initType);
      setOpen(true);
    }
  }, [initType]);

  const { rule, updateActiveRule, getNodeInfo, getVariableInfo } =
    usePatients();
  const { showToast } = useToast();
  const alertError = (v: string) => showToast(v, "error");

  const generatedId = form?.name?.trim()?.toLowerCase().replace(/\s+/g, "_");

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!nodeType) {
      alertError("Please choose node type");
      return;
    }

    // validate base
    if (!form.name || !form.cate) {
      alertError("Missing name or cate");
      return;
    }

    // validate special types
    if (nodeType === "IF") {
      if (!form.cond || !form.then || !form.else) {
        alertError("Missing cond/then/else");
        return;
      }
    } else if (nodeType === "DOMAIN_MAP") {
      if (domainItems.some((i) => !i.domain_id || !i.rule)) {
        alertError("Missing domain_id or rule in DOMAIN_MAP items");
        return;
      }
    } else if (nodeType === "ANY" || nodeType === "ALL") {
      if (!form.children || form.children.length === 0) {
        alertError("Missing children");
        return;
      }
    } else if (nodeType === "REGIMEN_RESOLVE") {
      if (!form["input.eligible_domains_ref"]) {
        alertError("Missing regimen input");
        return;
      }
      if (constraints.some((c) => !c.regimen_id || !c.exclude_if)) {
        alertError("Missing regimen_id or exclude_if in constraints");
        return;
      }
    } else {
      const fields = NODE_FIELDS[nodeType as NodeType];
      const missing = fields.filter((f) => {
        if (f.optional) return false;
        return !form[f.key] || form[f.key].toString().trim() === "";
      });
      if (missing.length > 0) {
        alertError(
          `Missing required fields: ${missing.map((m) => m.label).join(", ")}`
        );
        return;
      }
    }

    let newNode: any = { name: form.name, cate: form.cate, type: nodeType };

    if (nodeType === "DOMAIN_MAP") {
      newNode.items = domainItems;
    } else if (nodeType === "IF") {
      newNode.cond = form.cond;
      newNode.then = form.then;
      newNode.else = form.else;
    } else if (nodeType === "ANY" || nodeType === "ALL") {
      newNode.children = form.children;
    } else if (nodeType === "REGIMEN_RESOLVE") {
      newNode["input.eligible_domains_ref"] =
        form["input.eligible_domains_ref"];
      newNode.require_min_regimens = form.require_min_regimens || 1;
      newNode.reason_on_fail = form.reason_on_fail;
      newNode.constraints = constraints;
    } else {
      newNode = { ...newNode, ...form };
    }
    const newNodeData = objExpandKeys(newNode);

    const nodes = rule?.logic?.nodes || {};

    if (nodes[generatedId] && !initForm) {
      showToast("Node already exists!", "info");
    }

    nodes[generatedId] = newNodeData;
    const newRule = {
      ...rule,
      logic: {
        ...rule?.logic,
        nodes,
      },
    };
    const result = await updateRule(rule._id, newRule);
    if (result) {
      updateActiveRule(result);
      showToast(initForm ? "Updated Node!" : "Added Node!", "success");
    }

    // reset
    if (!initForm) {
      setOpen(false);
      setNodeType("");
      setForm({ cate: "1" });
      setDomainItems([{ domain_id: domains[0] || "", rule: nodes[0] || "" }]);
      setConstraints([
        {
          regimen_id: regimens[0] || "",
          exclude_if: nodes[0] || "",
          reason_on_exclude: "",
        },
      ]);
    } else {
      setOpen(false);
    }
    onClose();
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create Node
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 pb-12 w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Create Node</h2>

            {/* type */}
            <div className="mb-3">
              <label className="block text-sm mb-1">Node Type</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value as NodeType)}
              >
                <option value="">Select type</option>
                {Object.keys(NODE_FIELDS).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* name */}
            <div className="mb-3">
              <label className="block text-sm mb-1">Name</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={form.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">ID</label>
              <div>{generatedId}&nbsp;</div>
            </div>

            {/* cate */}
            <div className="mb-3">
              <label className="block text-sm mb-1">Category</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={form.cate || ""}
                onChange={(e) => handleChange("cate", e.target.value)}
              >
                {cateList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* default fields */}
            {nodeType &&
              !["IF", "DOMAIN_MAP", "ANY", "ALL", "REGIMEN_RESOLVE"].includes(
                nodeType
              ) &&
              NODE_FIELDS[nodeType as NodeType].map((f) => {
                if (f.key === "input.var") {
                  return (
                    <div className="mb-3" key={f.key}>
                      <label className="block text-sm mb-1">{f.label}</label>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={form[f.key]}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                      >
                        <option key="null">Select variable</option>
                        {variables.map((n) => (
                          <option key={n} value={n}>
                            {getVariableInfo(n)?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (f.key === "operator") {
                  return (
                    <div className="mb-3" key={f.key}>
                      <label className="block text-sm mb-1">{f.label}</label>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={form[f.key]}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                      >
                        <option key="null">Select operator</option>
                        {"<, >, <=, >=, ==, !=".split(",").map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return (
                  <div className="mb-3" key={f.key}>
                    <label className="block text-sm mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      className="w-full border rounded px-2 py-1"
                      value={form[f.key] || f?.default || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                    />
                  </div>
                );
              })}

            {/* IF */}
            {nodeType === "IF" && (
              <div className="space-y-3">
                {["cond", "then", "else"].map((k) => (
                  <div key={k}>
                    <label className="block text-sm mb-1">{k}</label>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={form[k] || ""}
                      onChange={(e) => handleChange(k, e.target.value)}
                    >
                      <option key="null">Select node</option>
                      {nodes.map((n) => (
                        <option key={n} value={n}>
                          {getNodeInfo(n)?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* ANY / ALL */}
            {(nodeType === "ANY" || nodeType === "ALL") && (
              <TagInput
                label="Children"
                value={form.children || []}
                onChange={(val) => handleChange("children", val)}
                options={nodes}
                optNames={Object.fromEntries(
                  nodes.map((k) => {
                    const name = getNodeInfo(k)?.name;
                    return [k, name];
                  })
                )}
                placeholder="node id..."
                color="blue"
              />
            )}

            {/* DOMAIN_MAP */}
            {nodeType === "DOMAIN_MAP" && (
              <div>
                <label className="block text-sm font-medium mb-2">Items</label>
                {domainItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <div className="w-full">
                      <div>Domain id</div>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={item.domain_id}
                        onChange={(e) => {
                          const copy = [...domainItems];
                          copy[idx].domain_id = e.target.value;
                          setDomainItems(copy);
                        }}
                      >
                        <option value="">Select domain</option>
                        {domains.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full">
                      <div>Rule</div>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={item.rule}
                        onChange={(e) => {
                          const copy = [...domainItems];
                          copy[idx].rule = e.target.value;
                          setDomainItems(copy);
                        }}
                      >
                        <option value="">Select rule node</option>
                        {nodes.map((n) => (
                          <option key={n} value={n}>
                            {getNodeInfo(n)?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setDomainItems([
                      ...domainItems,
                      { domain_id: "", rule: "" },
                    ])
                  }
                  className="mt-1 px-3 py-1 bg-gray-200 rounded"
                >
                  + Add row
                </button>
              </div>
            )}

            {/* REGIMEN_RESOLVE */}
            {nodeType === "REGIMEN_RESOLVE" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Regimen input</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={form["input.eligible_domains_ref"] || ""}
                    onChange={(e) =>
                      handleChange("input.eligible_domains_ref", e.target.value)
                    }
                  >
                    <option key="null">Select domain</option>
                    {domainNodes.map((r) => (
                      <option key={r} value={r}>
                        {getNodeInfo(r)?.name}
                      </option>
                    ))}
                  </select>
                </div>

                {NODE_FIELDS["REGIMEN_RESOLVE"].map((f) => (
                  <div className="mb-3" key={f.key}>
                    <label className="block text-sm mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      className="w-full border rounded px-2 py-1"
                      value={form[f.key] || f.default || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                    />
                  </div>
                ))}

                <label className="block text-sm font-medium mb-2">
                  Constraints
                </label>
                {constraints.map((c, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <div className="w-full">
                      <div>Regimen id</div>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={c.regimen_id}
                        onChange={(e) => {
                          const copy = [...constraints];
                          copy[idx].regimen_id = e.target.value;
                          setConstraints(copy);
                        }}
                      >
                        <option key="null">Select regimen</option>
                        {regimens.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full">
                      <div>Exclude If</div>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={c.exclude_if}
                        onChange={(e) => {
                          const copy = [...constraints];
                          copy[idx].exclude_if = e.target.value;
                          setConstraints(copy);
                        }}
                      >
                        <option key="null">Select node</option>
                        {nodes.map((n) => (
                          <option key={n} value={n}>
                            {getNodeInfo(n)?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full">
                      <div>Reason</div>
                      <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="Reason"
                        value={c.reason_on_exclude}
                        onChange={(e) => {
                          const copy = [...constraints];
                          copy[idx].reason_on_exclude = e.target.value;
                          setConstraints(copy);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setConstraints([
                      ...constraints,
                      { regimen_id: "", exclude_if: "", reason_on_exclude: "" },
                    ])
                  }
                  className="mt-1 px-3 py-1 bg-gray-200 rounded"
                >
                  + Add constraint
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  onClose();
                  setOpen(false);
                }}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
