"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Users, Target } from "lucide-react";
import Link from "next/link";

const menu = [
  { label: "Patient", icon: Home, href: "/patient" },
  { label: "Roadmap", icon: ClipboardList, href: "/roadmap" },
  { label: "Logs", icon: Target, href: "/logs" },
  { label: "Mermaid", icon: ClipboardList, href: "/roadmap-2" },
  // { label: "Population", icon: Users, href: "/population" },
  // { label: "Objectives", icon: Target, href: "/objectives" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="px-6 py-4 font-bold text-purple-700 text-xl">EMPIRIC</div>
      <nav className="flex-1 px-4 space-y-1">
        {menu.map((item) => {
          const isActive = mounted && pathname === item.href;
          return (
            <Link
              key={item.href}
              href={`${item.href}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                }
              `}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
