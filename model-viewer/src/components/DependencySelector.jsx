import React, { useState } from "react";
import { Link } from "lucide-react";

const allTasks = [
  { id: "T-101", title: "Fix login issue" },
  { id: "T-102", title: "Implement user roles" },
  { id: "T-103", title: "Create wireframes" },
  { id: "T-104", title: "Setup database schema" },
];

const DependencySelector = React.forwardRef(
  ({ selected = [], onChange, open, setOpen }, ref) => {
    const [search, setSearch] = useState("");

    const toggleDependency = (taskId) => {
      if (selected.includes(taskId)) {
        onChange(selected.filter((id) => id !== taskId));
      } else {
        onChange([...selected, taskId]);
      }
    };

    const filteredTasks = allTasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div ref={ref} className="relative inline-block text-left">
        {/* Trigger button */}
        <button
          type="button" // ✅ Prevents form submit
          onClick={(e) => {
            e.preventDefault(); // ✅ Extra safety
            setOpen(open ? null : "dependencies");
          }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm shadow-sm
    border border-gray-300
    ${open ? "bg-gray-200" : "hover:bg-gray-50"}
    focus:outline-none focus:ring-0 focus:border-gray-300
    active:outline-none active:ring-0 active:border-gray-300
    hover:border-gray-300`}
        >
          <Link className="w-4 h-4" />
          Dependencies
          {selected.length > 0 && (
            <div className="flex gap-1 ml-2">
              {selected.map((id) => {
                const task = allTasks.find((t) => t.id === id);
                return (
                  <span
                    key={id}
                    className="px-2 py-0.5 rounded-full bg-gray-100 text-xs border"
                  >
                    {task?.title || id}
                  </span>
                );
              })}
            </div>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute z-20 mt-2 w-72 bg-white border rounded-md shadow-lg p-3 space-y-2"
            onClick={(e) => e.stopPropagation()} // ✅ Prevents closing due to outside click
          >
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border px-2 py-1 rounded text-sm"
              onClick={(e) => e.stopPropagation()} // ✅ No form submit
            />

            <div className="max-h-48 overflow-y-auto">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <label
                    key={task.id}
                    className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                    onClick={(e) => e.stopPropagation()} // ✅ Prevents closing dropdown
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(task.id)}
                      onChange={(e) => {
                        e.preventDefault(); // ✅ Stops form submit
                        toggleDependency(task.id);
                      }}
                    />
                    <span>{task.title}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No matching tasks
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default DependencySelector;