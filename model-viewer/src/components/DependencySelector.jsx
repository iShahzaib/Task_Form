import React, { useState } from "react";
import { Link } from "lucide-react";

const allTasks = [
  { id: "T-101", title: "Fix login issue" },
  { id: "T-102", title: "Implement user roles" },
  { id: "T-103", title: "Create wireframes" },
  { id: "T-104", title: "Setup database schema" },
];

function DependencySelector({ selected = [], onChange, open, setOpen }) {
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
    <div className="relative inline-block text-left">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(open ? null : "dependencies")}
        className="inline-flex items-center px-3 py-1 border rounded-full text-sm bg-white hover:bg-gray-50 shadow-sm gap-2"
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
        <div className="absolute z-20 mt-2 w-72 bg-white border rounded-md shadow-lg p-3 space-y-2">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border px-2 py-1 rounded text-sm"
          />

          <div className="max-h-48 overflow-y-auto">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(task.id)}
                    onChange={() => toggleDependency(task.id)}
                  />
                  <span>{task.title}</span>
                </label>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No matching tasks</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DependencySelector;