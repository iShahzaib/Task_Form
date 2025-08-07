import React, { useState } from "react";
import {
  Check,
  Circle,
  Dot,
  Loader,
  CheckCircle,
  XCircle,
} from "lucide-react";

const statuses = [
  { label: "Backlog", icon: <Dot className="w-4 h-4 text-orange-500" /> },
  { label: "Planned", icon: <Circle className="w-4 h-4 text-gray-500" /> },
  { label: "In Progress", icon: <Loader className="w-4 h-4 text-yellow-500" /> },
  { label: "Completed", icon: <CheckCircle className="w-4 h-4 text-blue-600" /> },
  { label: "Canceled", icon: <XCircle className="w-4 h-4 text-gray-500" /> },
];

function StatusDropdown({ value, onChange, open, setOpen }) {
  const [search, setSearch] = useState("");

  const filtered = statuses.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(open ? null : "status")}
        className="inline-flex items-center gap-2 px-3 py-1 border rounded-full text-sm bg-white hover:bg-gray-50 shadow-sm"
      >
        {value || "Backlog"}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-2 w-64 rounded-md shadow-lg bg-white border p-2">
          {/* Search Header */}
          <div className="flex items-center justify-between text-xs text-gray-400 px-2 mb-1">
            <input
              type="text"
              placeholder="Change status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white p-1 px-2 text-sm border rounded text-gray-700"
            />
            <kbd className="mx-2 bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-[10px]">
              P
            </kbd>
            then
            <kbd className="ml-2 bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-[10px]">
              S
            </kbd>
          </div>

          {/* Filtered List */}
          {filtered.length === 0 ? (
            <div className="text-sm text-gray-400 px-3 py-2">No results</div>
          ) : (
            filtered.map((status, index) => (
              <button
                key={status.label}
                onClick={() => {
                  onChange(status.label);
                  setSearch("");
                  setOpen(null); // close dropdown
                }}
                className={`flex justify-between items-center w-full bg-white px-3 py-2 text-sm text-left rounded hover:bg-gray-100 ${
                  value === status.label ? "bg-gray-100 font-medium" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {status.icon}
                  {status.label}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {value === status.label && <Check className="w-4 h-4" />}
                  {index + 1}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default StatusDropdown;
