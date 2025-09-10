"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({
        x: rect.left + rect.width / 2,
        y: rect.bottom,
      });
    }
  }, [show]);

  return (
    <div
      ref={ref}
      className="inline-flex relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{ top: pos.y + 8, left: pos.x }}
          className="fixed z-50 -translate-x-1/2 px-3 py-1.5 text-xs text-white bg-gray-900 rounded-md shadow-lg whitespace-pre-line max-w-xs"
        >
          {content}
        </div>
      )}
    </div>
  );
}
