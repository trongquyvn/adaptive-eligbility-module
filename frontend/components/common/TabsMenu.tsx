"use client";

import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

export default function EligibilityTabs({ tabs = [] }: { tabs: any[] }) {
  // const searchParams = useSearchParams();
  // const router = useRouter();

  const defaultTab = tabs[0]?.id;
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // const newParams = new URLSearchParams(window.location.search);
    // newParams.set("tab", tabId);
    // router.replace(`?${newParams.toString()}`);
  };

  // useEffect(() => {
  //   const currentTab = searchParams.get("tab") || "overview";
  //   setActiveTab(currentTab);
  // }, [searchParams]);

  const Component = tabs.find((e) => e.id === activeTab);
  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium relative
              ${
                activeTab === tab.id
                  ? "text-purple-600 border-b-2 border-purple-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-5">
        <Component.component />
      </div>
    </div>
  );
}
