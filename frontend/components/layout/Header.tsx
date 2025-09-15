/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { usePatients } from "@/context/PatientContext";
import RulesModal from "@/components/rule/RulesModal";
import RuleCreator from "@/components/rule/RuleCreator";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/constants";
import { bumpVersion } from "@/lib/common";

async function createRules(body: any) {
  const res = await fetch(`${API_BASE_URL}/api/roadmap`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to save Rule");
  return res.json();
}

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [initialData, setInitialData] = useState<any>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const { rule, rules, addRule, activeRule, setActiveRule } = usePatients();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <h1 className="text-2xl font-semibold text-gray-800 cursor-pointer">
        {(rule?.trial?.id && rule?.trial?.version) && (
          <>
            {rule?.metadata?.title} - {rule?.trial?.id} ({rule?.trial?.version})
          </>
        )}
      </h1>
      <RulesModal
        active={activeRule}
        rules={rules}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onCreate={() => {
          setOpen(false);
          setOpenCreate(true);
        }}
        onActive={(e) => {
          setActiveRule(e);
          setOpen(false);
        }}
        onClone={(e) => {
          setInitialData({
            trial: {
              ...e.trial,
              version: bumpVersion(e.trial.version),
            },
            metadata: e.metadata,
          });
          setOpenCreate(true);
          setOpen(false);
        }}
      />
      <RuleCreator
        initialData={initialData}
        open={openCreate}
        onCreate={async (rule) => {
          const result = await createRules(rule);
          if (!result) return;
          addRule(result);
          showToast("Rule created successfully!", "success");
          setOpenCreate(false);
        }}
        onCancel={() => {
          setOpenCreate(false);
        }}
      />
      <div className="flex items-center gap-4">
        <div>
          <button
            onClick={() => {
              setOpen(true);
              setIsDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            Trial Builder
          </button>
        </div>
        {/* User Avatar and Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-gray-700">Admin</span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
