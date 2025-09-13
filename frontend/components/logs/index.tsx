"use client";

import { formatISODate } from "@/lib/common";
import { useState, useMemo } from "react";

export default function Logs({ logs = [], loading }: any) {
  const [patientId, setPatientId] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredLogs = useMemo(() => {
    return logs.filter((log: any) => {
      const matchPatient =
        !patientId ||
        log.patient_id?.toLowerCase().includes(patientId.toLowerCase());
      const matchRule =
        !ruleId || log.rule_id?.toLowerCase().includes(ruleId.toLowerCase());

      const logTime = new Date(log.timestamp).getTime();
      const fromTime = fromDate ? new Date(fromDate).getTime() : null;
      const toTime = toDate ? new Date(toDate).getTime() : null;
      const matchDate =
        (!fromTime || logTime >= fromTime) && (!toTime || logTime <= toTime);

      return matchPatient && matchRule && matchDate;
    });
  }, [logs, patientId, ruleId, fromDate, toDate]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) return <div className="p-4">Loading logs...</div>;

  return (
    <div className="p-6 space-y-4 bg-white">
      <h2 className="text-xl font-bold">Patient Evaluation Logs</h2>

      {/* Filter UI */}
      <div className="flex flex-wrap gap-3 items-end">
        <input
          type="text"
          placeholder="Filter by Patient ID"
          value={patientId}
          onChange={(e) => {
            setPatientId(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-1.5 w-56"
        />
        <input
          type="text"
          placeholder="Filter by Rule ID"
          value={ruleId}
          onChange={(e) => {
            setRuleId(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-1.5 w-56"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Patient ID</th>
              <th className="p-2 border">Registry code</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Rule</th>
              <th className="p-2 border">Reasons</th>
              <th className="p-2 border">Domains</th>
              <th className="p-2 border">Regimens</th>
              <th className="p-2 border">Data Needed</th>
              <th className="p-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center text-gray-500 py-4 border"
                >
                  No logs found
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log: any) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{log.patient_id}</td>
                  <td className="p-2 border">{log.registry_code || "-"}</td>
                  <td className="p-2 border">{log.status || "-"}</td>
                  <td className="p-2 border">
                    {log.rule_id} ({log.rule_version})
                  </td>
                  <td className="p-2 border">
                    {log.key_reasons?.join(", ") || "-"}
                  </td>
                  <td className="p-2 border">
                    {log.eligible_domains?.join(", ") || "-"}
                  </td>
                  <td className="p-2 border">
                    {log.eligible_regimens?.join(", ") || "-"}
                  </td>
                  <td className="p-2 border">
                    {log.data_needed?.join(", ") || "-"}
                  </td>
                  <td className="p-2 border">{formatISODate(log.timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
