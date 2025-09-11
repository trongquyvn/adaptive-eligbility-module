"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

type Props = {
  chart: string;
};

export default function MermaidChart({ chart }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: "default" });

    mermaid
      .render("graphDiv", chart)
      .then(({ svg }) => {
        setSvg(svg);
      })
      .catch((err) => {
        console.error("Mermaid render error:", err);
      });
  }, [chart]);

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ border: "1px solid #ccc", padding: 10 }}
    />
  );
}
