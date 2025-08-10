import React, { useState } from "react";
import { Check, AlertTriangle, BarChart3, Ellipsis } from "lucide-react";

const priorities = [
  { label: "No priority", icon: <Ellipsis className="w-4 h-4" /> },
  { label: "Urgent", icon: <AlertTriangle className="w-4 h-4 text-red-600" /> },
  { label: "High", icon: <BarChart3 className="w-4 h-4 text-orange-500" /> },
  { label: "Medium", icon: <BarChart3 className="w-4 h-4 text-yellow-500" /> },
  { label: "Low", icon: <BarChart3 className="w-4 h-4 text-green-500" /> },
];

const PriorityDropdown = React.forwardRef(
  ({ value, onChange, open, setOpen }, ref) => {
    const [search, setSearch] = useState("");

    const filtered = priorities.filter((p) =>
      p.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div ref={ref} className="relative inline-block text-left">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setOpen(open ? null : "priority")}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm shadow-sm
    border border-gray-300
    ${open ? "bg-gray-200" : "hover:bg-gray-50"}
    focus:outline-none focus:ring-0 focus:border-gray-300
    active:outline-none active:ring-0 active:border-gray-300
    hover:border-gray-300`}
        >
          <div className="flex items-center gap-2">
            {priorities.find((s) => s.label === value)?.icon || ""}
            {priorities.find((s) => s.label === value)?.label || "No priority"}
          </div>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-10 mt-2 w-64 rounded-md shadow-lg bg-white border p-2">
            {/* Search Header */}
            <div className="flex items-center justify-between text-xs text-gray-400 px-2 mb-1">
              <input
                type="text"
                placeholder="Change priority..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white p-1 px-2 text-sm border rounded text-gray-700"
              />
              <kbd className="mx-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">
                P
              </kbd>
              then
              <kbd className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">
                P
              </kbd>
            </div>

            {/* Filtered List */}
            {filtered.length === 0 ? (
              <div className="text-sm text-gray-400 px-3 py-2">No results</div>
            ) : (
              filtered.map((option, index) => (
                <button
                  key={option.label}
                  onClick={() => {
                    onChange(option.label);
                    setSearch("");
                    setOpen(null); // close dropdown
                  }}
                  className={`flex justify-between items-center w-full bg-white px-3 py-2 text-sm text-left rounded hover:bg-gray-100 ${value === option.label ? "bg-gray-100 font-medium" : ""
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {value === option.label && <Check className="w-4 h-4" />}
                    {index}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  }
);

export default PriorityDropdown;
