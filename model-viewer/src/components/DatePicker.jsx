import React, { useState } from "react";
import dayjs from "dayjs";

const views = ["Day", "Month", "Quarter", "Half-year", "Year"];

const DatePicker = React.forwardRef(
  ({ label = "Date", icon: Icon, value, onChange, open, setOpen }, ref) => {
    const [selectedDate, setSelectedDate] = useState(value || new Date());
    const [view, setView] = useState("Day");

    const handleDateClick = (day) => {
      const updated = new Date(selectedDate);
      updated.setDate(day);
      onChange(updated);
      setOpen(null); // close popup
    };

    const renderCalendar = () => {
      const current = dayjs(selectedDate);
      const start = current.startOf("month").startOf("week");
      const end = current.endOf("month").endOf("week");
      const today = dayjs();

      const days = [];
      let date = start;

      while (date.isBefore(end)) {
        for (let i = 0; i < 7; i++) {
          days.push(date);
          date = date.add(1, "day");
        }
      }

      return (
        <div>
          <div className="text-sm text-gray-700 font-semibold mb-1">
            {current.format("MMMM YYYY")}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const isCurrentMonth = day.month() === current.month();
              const isSelected = day.isSame(dayjs(selectedDate), "day");
              const isToday = day.isSame(today, "day");

              return (
                <button
                  key={idx}
                  onClick={() => handleDateClick(day.date())}
                  disabled={!isCurrentMonth}
                  className={`bg-white text-sm w-8 h-8 rounded-full 
                  ${isCurrentMonth ? "text-gray-800" : "text-gray-400"}
                  ${isSelected ? "bg-gray-200 font-bold" : ""}
                  ${isToday ? "border border-blue-400" : ""}
                  hover:bg-gray-100`}
                >
                  {day.date()}
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div ref={ref} className="relative inline-block text-left">
        {/* Trigger button */}
        <button
          onClick={() => setOpen(open ? null : label.toLowerCase())}
          className="inline-flex items-center gap-2 px-3 py-1 border rounded-full text-sm bg-white hover:bg-gray-50 shadow-sm"
        >
          {Icon && <Icon className="w-4 h-4" />}
          {label}
        </button>

        {/* Popup */}
        {open && (
          <div className="absolute z-20 mt-2 w-80 bg-white border rounded-md shadow-lg p-4">
            <label className="block text-sm text-gray-700 mb-1">
              {label} date
            </label>
            <input
              type="text"
              className="w-full bg-white border rounded p-1 text-sm mb-3"
              placeholder="Try: May 2026, Q4, 20/05/2026"
              defaultValue={dayjs(selectedDate).format("DD/MM/YYYY")}
            />

            {/* View mode tabs */}
            <div className="flex space-x-2 mb-3 text-xs text-gray-500">
              {views.map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`bg-white px-2 py-0.5 border rounded ${
                    view === v ? "bg-gray-200 border-gray-400 font-medium" : ""
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Calendar view */}
            {view === "Day" && renderCalendar()}
          </div>
        )}
      </div>
    );
  }
);

export default DatePicker;
