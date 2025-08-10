import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const views = ["Day", "Month", "Quarter", "Half-year", "Year"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Props:
 * - label: "Start" | "Target" (used for trigger text / key)
 * - icon: icon component (optional)
 * - value: Date | null
 * - onChange: (Date) => void
 * - open: boolean
 * - setOpen: (value|null|"start"|"target"|"whatever") => void
 *
 * The component keeps internal selectedDate sync with `value`.
 * It does NOT auto-close on day click; user must click "Done" (or click outside).
 */
const DatePicker = React.forwardRef(
  ({ label = "Date", icon: Icon, value, onChange, open, setOpen }, ref) => {
    const [selectedDate, setSelectedDate] = useState(value || null);
    const [view, setView] = useState("Day");
    const [yearRangeStart, setYearRangeStart] = useState(
      dayjs(value || new Date()).year() - 4
    );

    useEffect(() => {
      setSelectedDate(value || null);
    }, [value]);

    const changeDate = (amount, unit) => {
      setSelectedDate(
        dayjs(selectedDate || new Date())
          .add(amount, unit)
          .toDate()
      );
    };

    const selectDate = (dayObj) => {
      const d = dayObj.toDate();
      setSelectedDate(d);
      onChange && onChange(d);
      // keep picker open so user can adjust; they can press Done to close
    };

    // Pick month (0..11) -> set selectedDate to first day of that month, show Day view
    const selectMonth = (monthIdx) => {
      const d = dayjs(selectedDate || new Date())
        .month(monthIdx)
        .date(1)
        .toDate();
      setSelectedDate(d);
      onChange && onChange(d);
      setView("Day");
    };

    // Pick quarter (1..4) -> set month to quarter start and show day view
    const selectQuarter = (q) => {
      const monthIdx = (q - 1) * 3;
      const d = dayjs(selectedDate || new Date())
        .month(monthIdx)
        .date(1)
        .toDate();
      setSelectedDate(d);
      onChange && onChange(d);
      setView("Day");
    };

    // Pick half (1 or 2)
    const selectHalf = (h) => {
      const monthIdx = h === 1 ? 0 : 6;
      const d = dayjs(selectedDate || new Date())
        .month(monthIdx)
        .date(1)
        .toDate();
      setSelectedDate(d);
      onChange && onChange(d);
      setView("Day");
    };

    // Pick year -> show month/day for that year
    const selectYear = (year) => {
      const d = dayjs(selectedDate || new Date())
        .year(year)
        .month(0)
        .date(1)
        .toDate();
      setSelectedDate(d);
      onChange && onChange(d);
      setView("Day");
    };

    // Calendar generation: Monday-first
    const renderCalendar = () => {
      const base = selectedDate || new Date();
      const current = dayjs(base);
      const firstOfMonth = current.startOf("month");
      const subtractDays = (firstOfMonth.day() + 6) % 7;
      const start = firstOfMonth.subtract(subtractDays, "day");
      const lastOfMonth = current.endOf("month");
      const addDays = (7 - lastOfMonth.day()) % 7;
      const end = lastOfMonth.add(addDays, "day");

      const today = dayjs();
      const days = [];
      let iter = start;
      while (iter.isBefore(end) || iter.isSame(end, "day")) {
        days.push(iter);
        iter = iter.add(1, "day");
      }

      return (
        <div>
          {/* Header with arrows */}
          <div className="flex items-center justify-between mb-1">
            <button
              type="button"
              onClick={() => changeDate(-1, "month")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ◀
            </button>
            <div className="text-sm text-gray-700 font-semibold">
              {current.format("MMMM YYYY")}
            </div>
            <button
              type="button"
              onClick={() => changeDate(1, "month")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ▶
            </button>
          </div>

          {/* Week headers (Monday-first) */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((dayObj, idx) => {
              const isCurrentMonth = dayObj.month() === current.month();
              const isSelected =
                selectedDate && dayObj.isSame(dayjs(selectedDate), "day");
              const isToday = dayObj.isSame(today, "day");

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectDate(dayObj)}
                  disabled={!isCurrentMonth}
                  className={`bg-white w-9 h-9 rounded-full inline-flex items-center justify-center
                    ${isCurrentMonth ? "text-gray-800" : "text-gray-400"}
                    ${isSelected
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : ""
                    }
                    ${isToday ? "ring-1 ring-blue-300" : ""}
                    hover:bg-gray-100`}
                >
                  {/* centered number */}
                  <span className="text-sm leading-none">{dayObj.date()}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    const renderMonths = () => {
      const current = dayjs(selectedDate || new Date());
      return (
        <div>
          <div className="flex items-center justify-between mb-1">
            <button
              type="button"
              onClick={() => changeDate(-1, "year")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ◀
            </button>
            <div className="text-sm text-gray-700 font-semibold">
              {current.year()}
            </div>
            <button
              type="button"
              onClick={() => changeDate(1, "year")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ▶
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {monthNames.map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => selectMonth(i)}
                className={`px-2 py-2 text-sm rounded border ${current.month() === i
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-white"
                  }`}
              >
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      );
    };

    const renderQuarters = () => {
      const current = dayjs(selectedDate || new Date());
      return (
        <div>
          <div className="flex items-center justify-between mb-1">
            <button
              type="button"
              onClick={() => changeDate(-1, "year")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ◀
            </button>
            <div className="text-sm text-gray-700 font-semibold">
              {current.year()}
            </div>
            <button
              type="button"
              onClick={() => changeDate(1, "year")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ▶
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => selectQuarter(q)}
                className={`px-3 py-2 rounded border text-sm ${Math.floor(current.month() / 3) + 1 === q
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-white"
                  }`}
              >
                Q{q}
              </button>
            ))}
          </div>
        </div>
      );
    };

    const renderHalves = () => {
      const current = dayjs(selectedDate || new Date());
      return (
        <div>
          <div className="flex items-center justify-between mb-1">
            <button
              type="button"
              onClick={() => changeDate(-1, "year")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ◀
            </button>
            <div className="text-sm text-gray-700 font-semibold">
              {current.year()}
            </div>
            <button
              type="button"
              onClick={() => changeDate(1, "year")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ▶
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => selectHalf(h)}
                className={`px-4 py-2 rounded border text-sm ${(h === 1 && current.month() < 6) ||
                    (h === 2 && current.month() >= 6)
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-white"
                  }`}
              >
                H{h}
              </button>
            ))}
          </div>
        </div>
      );
    };

    const renderYears = () => {
      const years = [];
      for (let y = yearRangeStart; y < yearRangeStart + 9; y++) years.push(y);
      const currentYear = dayjs(selectedDate || new Date()).year();
      return (
        <div>
          <div className="flex items-center justify-between mb-1">
            <button
              type="button"
              onClick={() => setYearRangeStart(yearRangeStart - 9)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ◀
            </button>
            <div className="text-sm text-gray-700 font-semibold">
              {yearRangeStart} - {yearRangeStart + 8}
            </div>
            <button
              type="button"
              onClick={() => setYearRangeStart(yearRangeStart + 9)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ▶
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => selectYear(y)}
                className={`px-2 py-2 rounded border text-sm ${y === currentYear
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-white"
                  }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      );
    };

    // Display value on pill (formatted)
    const formatted = selectedDate
      ? dayjs(selectedDate).format("DD MMM YYYY")
      : null;

    return (
      <div ref={ref} className="relative inline-block text-left">
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setOpen(open ? null : label.toLowerCase())}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm shadow-sm
    border border-gray-300
    ${open ? "bg-gray-200" : "hover:bg-gray-50"}
    focus:outline-none focus:ring-0 focus:border-gray-300
    active:outline-none active:ring-0 active:border-gray-300
    hover:border-gray-300`}
        >
          {Icon && <Icon className="w-4 h-4" />}
          <span className="whitespace-nowrap">{label}</span>

          {/* pill with date */}
          {formatted && (
            <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-700">
              {formatted}
            </span>
          )}
        </button>

        {/* Popup */}
        {open && (
          <div className="absolute z-20 mt-2 w-[320px] bg-white border rounded-md shadow-lg p-4">
            <label className="block text-sm text-gray-700 mb-2">
              {label} date
            </label>

            {/* readonly display for chosen date */}
            <input
              readOnly
              type="text"
              className={`w-full bg-white border rounded p-1 text-sm mb-3 ${selectedDate ? "text-gray-900" : "text-gray-400"
                }`}
              placeholder="Try: May 2026, Q4, 20/05/2026"
              value={
                selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""
              }
            />

            {/* view tabs */}
            <div className="flex space-x-2 mb-3 text-xs text-gray-500">
              {views.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`px-2 py-0.5 border rounded text-xs ${view === v
                      ? "bg-gray-200 border-gray-400 font-medium"
                      : "bg-white"
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* views */}
            <div className="min-h-[170px]">
              {view === "Day" && renderCalendar()}
              {view === "Month" && renderMonths()}
              {view === "Quarter" && renderQuarters()}
              {view === "Half-year" && renderHalves()}
              {view === "Year" && renderYears()}
            </div>

            {/* footer */}
            <div className="flex justify-between items-center mt-3">
              <div className="text-xs text-gray-500">
                {/* quick actions */}
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    setSelectedDate(today);
                    onChange && onChange(today);
                  }}
                  className="text-xs text-blue-600 hover:underline mr-2"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(null);
                    onChange && onChange(null);
                    setView("Day");
                  }}
                  className="text-xs text-gray-600 hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default DatePicker;
