"use client";

import { useState } from "react";

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  color?: "purple" | "green" | "red" | "yellow" | "blue" | "gray"; 
}

export default function TagInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter",
  required = false,
  options = [],
  color = "gray",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAdd = (newTag: string) => {
    if (!newTag.trim() || value.includes(newTag)) return;
    onChange([...value, newTag.trim()]);
    setInputValue("");
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAdd(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const filteredOptions = options.filter(
    (opt) =>
      opt.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(opt)
  );

  // mapping màu cho tag
  const colorClasses: Record<string, string> = {
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input box chứa tags */}
      <div className="flex flex-wrap items-center gap-2 w-full px-2 py-1 border rounded-md focus-within:ring-1 focus-within:ring-purple-500">
        {value.map((tag, idx) => (
          <span
            key={idx}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${colorClasses[color]}`}
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          placeholder={value.length === 0 ? placeholder : ""}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          className="flex-1 min-w-[100px] px-2 py-1 outline-none"
        />
      </div>

      {/* Dropdown suggestion */}
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow">
          {filteredOptions.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => handleAdd(opt)}
              className="px-3 py-2 cursor-pointer hover:bg-purple-50"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
