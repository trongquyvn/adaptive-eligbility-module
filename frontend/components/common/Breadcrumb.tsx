"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  href?: string;
  label: string;
}

interface BreadcrumbProps {
  items: Crumb[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="flex items-center text-sm text-gray-500"
      aria-label="Breadcrumb"
    >
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center">
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-700 font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-purple-600">{item.label}</span>
          )}
          {idx < items.length - 1 && (
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          )}
        </div>
      ))}
    </nav>
  );
}
