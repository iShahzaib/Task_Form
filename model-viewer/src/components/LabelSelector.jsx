import React from "react";
import { Tag } from "lucide-react";

const allLabels = [
  { id: "bug", name: "Bug", color: "bg-red-100 text-red-800" },
  { id: "feature", name: "Feature", color: "bg-green-100 text-green-800" },
  { id: "design", name: "Design", color: "bg-blue-100 text-blue-800" },
  { id: "research", name: "Research", color: "bg-yellow-100 text-yellow-800" },
];

function LabelSelector({ selected = [], onChange, open, setOpen }) {
  const toggleLabel = (labelId) => {
    if (selected.includes(labelId)) {
      onChange(selected.filter((id) => id !== labelId));
    } else {
      onChange([...selected, labelId]);
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(open ? null : "labels")}
        className="inline-flex items-center px-3 py-1 border rounded-full text-sm bg-white hover:bg-gray-50 shadow-sm gap-2"
      >
        <Tag className="w-4 h-4" />
        Labels
        {selected.length > 0 && (
          <div className="flex gap-1 ml-2">
            {selected.map((id) => {
              const label = allLabels.find((l) => l.id === id);
              return (
                <span
                  key={id}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${label.color}`}
                >
                  {label.name}
                </span>
              );
            })}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-2 w-56 bg-white border rounded-md shadow-lg p-2 space-y-2">
          {allLabels.map((label) => (
            <label
              key={label.id}
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(label.id)}
                onChange={() => toggleLabel(label.id)}
                className="accent-blue-600"
              />
              <span
                className={`${label.color} px-2 py-0.5 rounded-full text-xs`}
              >
                {label.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default LabelSelector;
