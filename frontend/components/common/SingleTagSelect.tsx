"use client";

import { useState } from "react";

interface Option {
  label: string;
  value: string;
  color?: string; // "green" | "red" | "gray" | ...
}

interface SingleTagSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
  options: Option[];
  placeholder?: string;
}

export default function SingleTagSelect({
  label,
  value,
  onChange,
  required = false,
  options,
  placeholder = "Select option",
}: SingleTagSelectProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((opt) => opt.value === value) || null;

  // tĩnh mapping cho background + text của tag
  const colorTagClasses: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };

  // tĩnh mapping cho dot nhỏ (sử dụng class Tailwind hợp lệ)
  const dotColorClasses: Record<string, string> = {
    green: "bg-green-600",
    red: "bg-red-600",
    gray: "bg-gray-600",
    yellow: "bg-yellow-600",
    blue: "bg-blue-600",
    purple: "bg-purple-600",
  };

  const selectedTagClass = selected?.color ? (colorTagClasses[selected.color] ?? colorTagClasses["gray"]) : "";
  const selectedDotClass = selected?.color ? (dotColorClasses[selected.color] ?? dotColorClasses["gray"]) : "";

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Display box */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-3 py-2 border rounded-md flex items-center justify-between cursor-pointer bg-white"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen((s) => !s);
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {selected ? (
          <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${selectedTagClass}`}>
            {/* dùng mapping tĩnh cho dot */}
            <span className={`w-2 h-2 rounded-full ${selectedDotClass}`} />
            {selected.label}
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <span className="text-gray-500">▾</span>
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg max-h-56 overflow-auto">
          {options.map((opt) => {
            const optTagClass = opt.color ? (colorTagClasses[opt.color] ?? colorTagClasses["gray"]) : colorTagClasses["gray"];
            const optDotClass = opt.color ? (dotColorClasses[opt.color] ?? dotColorClasses["gray"]) : dotColorClasses["gray"];
            return (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2"
                role="option"
                aria-selected={value === opt.value}
              >
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${optTagClass}`}>
                  <span className={`w-2 h-2 rounded-full ${optDotClass}`} />
                  {opt.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
