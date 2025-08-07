import React, { useRef, useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { format } from "date-fns";

function MilestoneModal({ onClose, onAdd }) {
  const modalRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [milestone, setMilestone] = useState({
    name: "",
    description: "",
    targetDate: new Date(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMilestone((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setMilestone((prev) => ({ ...prev, targetDate: newDate }));
    setShowCalendar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (milestone.name.trim()) {
      onAdd(milestone);
      onClose();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-md w-full max-w-3xl border shadow-lg"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b text-lg font-medium text-gray-800">
          Create milestone
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="text-xl">◇</div>

            {/* Inputs */}
            <div className="flex-1 space-y-4">
              <input
                type="text"
                name="name"
                value={milestone.name}
                onChange={handleChange}
                placeholder="Milestone name"
                className="w-full bg-white text-gray-900 text-base font-medium placeholder-gray-400 focus:outline-none"
                required
              />

              <textarea
                name="description"
                value={milestone.description}
                onChange={handleChange}
                placeholder="Add a description..."
                rows={2}
                className="w-full text-sm text-gray-600 placeholder-gray-400 bg-white focus:outline-none"
              />
            </div>

            {/* Calendar + Input inline */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Add target date"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <CalendarPlus className="w-5 h-5 text-gray-600 hover:text-black" />
              </button>
              {showCalendar && (
                <input
                  type="date"
                  value={format(milestone.targetDate, "yyyy-MM-dd")}
                  onChange={handleDateChange}
                  className="bg-white border rounded px-2 py-1 text-sm"
                />
              )}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
            >
              Add milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MilestoneModal;
