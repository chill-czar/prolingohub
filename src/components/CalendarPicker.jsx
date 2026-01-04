"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPicker({ selectedDates = [], onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // CLIENT HOLIDAYS / BLOCKED DATES
  const blockedDates = ["2025-10-10", "2025-10-15", "2025-10-20"];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const start = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days = [];
    for (let i = 0; i < start; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const isSelected = (date) =>
    selectedDates.some((d) => d?.toDateString() === date?.toDateString());

  const isPast = (date) => date < today;

  const isBlocked = (date) =>
    blockedDates.includes(date.toISOString().split("T")[0]);

  const days = getDaysInMonth();

  return (
    <div className="px-8 py-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[16px] font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  1,
                ),
              )
            }
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  1,
                ),
              )
            }
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 text-center text-[12px] text-gray-500 mb-3">
        {dayNames.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-y-4 text-center">
        {days.map((date, i) =>
          date ? (
            <button
              key={i}
              disabled={isPast(date) || isBlocked(date)}
              onClick={() => onDateSelect([date])}
              className={`w-10 h-10 mx-auto rounded-full text-[14px]
                                ${
                                  isSelected(date)
                                    ? "bg-redy text-white font-semibold"
                                    : isPast(date) || isBlocked(date)
                                      ? "text-gray-300 cursor-not-allowed"
                                      : "text-gray-700 hover:bg-gray-100"
                                }`}
            >
              {date.getDate()}
            </button>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
    </div>
  );
}
