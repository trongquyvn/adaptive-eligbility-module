"use client";

import { useEffect, useState } from "react";

interface EvaluationLog {
  _id: string;
  patient_id: string;
  evaluated_at: string;
  registry_code?: string;
  status: string;
  key_reasons: string[];
  eligible_domains: string[];
  eligible_regimens: string[];
  data_needed: string[];
  rule_id: string;
  rule_version: string;
  patientData: any;
  rule: any;
  timestamp: string;
}

interface Props {
  patientId: string;
  open: boolean;
  onClose: () => void;
}

export default function PatientLogModal({ patientId, open, onClose }: Props) {
  const [logs, setLogs] = useState<EvaluationLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
  }, [open, patientId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Logs for Patient: {patientId}</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
        </div>

        {loading && <p>Loading logs...</p>}

        {!loading && logs.length === 0 && (
          <p className="text-gray-500">No logs found.</p>
        )}

        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="border rounded-md p-4 bg-gray-50 shadow-sm"
            >
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Evaluated:{" "}
                  {new Date(log.evaluated_at || log.timestamp).toLocaleString()}
                </span>
                <span>
                  Status:{" "}
                  <span
                    className={
                      log.status === "Eligible"
                        ? "text-green-600 font-medium"
                        : log.status === "Pending"
                        ? "text-yellow-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {log.status}
                  </span>
                </span>
              </div>

              <p>
                <strong>Registry Code:</strong> {log.registry_code || "-"}
              </p>
              <p>
                <strong>Rule:</strong> {log.rule_id} ({log.rule_version})
              </p>

              <div className="mt-2">
                <strong>Key Reasons:</strong>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {log.key_reasons?.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-2">
                <strong>Eligible Domains:</strong>{" "}
                {log.eligible_domains?.join(", ") || "-"}
              </div>

              <div className="mt-1">
                <strong>Eligible Regimens:</strong>{" "}
                {log.eligible_regimens?.join(", ") || "-"}
              </div>

              {log.data_needed?.length > 0 && (
                <div className="mt-1">
                  <strong>Data Needed:</strong> {log.data_needed.join(", ")}
                </div>
              )}

              {/* Optional: show JSON detail */}
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600">
                  Patient Data
                </summary>
                <pre className="bg-white border p-2 text-xs overflow-x-auto">
                  {JSON.stringify(log.patientData, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
