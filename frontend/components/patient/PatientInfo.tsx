"use client";

import { getValueByPath } from "@/lib/common";
import { useState, useEffect } from "react";

function BooleanTag({ value }: { value: any }) {
  const isTrue = value === true || value === "true";
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        isTrue ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isTrue ? "Yes" : "No"}
    </span>
  );
}

function NumberTag({ value }: { value: any }) {
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
      {value}
    </span>
  );
}

function formatTime(value: string) {
  if (!value) return "";
  try {
    const d = new Date(value);
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default function PatientInfo({
  patientData,
  variables,
}: {
  patientData: any;
  variables: any[];
}) {
  const rows = [];
  for (let i = 0; i < variables.length; i += 2) {
    rows.push(variables.slice(i, i + 2));
  }

  return (
    <div className="space-y-4 w-11/12">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-2 gap-4">
          {row.map((v) => {
            const value = getValueByPath(patientData, v.id);

            return (
              <div key={v.id}>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {v.name}:
                </h3>
                {typeof value === "undefined" ? (
                  <span>Empty</span>
                ) : (
                  <>
                    {v.type === "BOOLEAN" ? (
                      <BooleanTag value={value} />
                    ) : v.type === "COMPARE" || v.type === "NUMBER" ? (
                      <NumberTag value={value} />
                    ) : v.type === "TIME_WINDOW" ? (
                      <p className="text-sm text-gray-600">
                        {formatTime(value)}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {String(value ?? "")}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
