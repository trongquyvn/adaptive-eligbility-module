"use client";

import { useState } from "react";
import ReactJson from "@microlink/react-json-view";

type JsonEditorProps = {
  value: any;
  onSave: (data: any) => void;
};

export default function JsonEditor({ value, onSave }: JsonEditorProps) {
  const [data, setData] = useState(value);

  const handleEdit = (edit: any) => {
    setData(edit.updated_src);
  };

  const handleSave = () => {
    onSave(data);
  };

  return (
    <div className="w-full">
      <ReactJson
        src={data}
        theme="rjv-default"
        collapsed={2}
        enableClipboard={true}
        displayDataTypes={false}
        onEdit={handleEdit}
        onAdd={handleEdit}
        onDelete={handleEdit}
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "6px",
        }}
      />
      <div className="mt-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
