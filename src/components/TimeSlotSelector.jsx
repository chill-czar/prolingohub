"use client";

export default function TimeSlotSelector({
  availableSlots = [],
  selectedSlot,
  onSlotSelect,
}) {
  return (
    <div className="space-y-2">
      {availableSlots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSlotSelect(slot)}
          className={`w-full px-4 py-2.5 rounded-md border text-[13px]
                        flex items-center gap-3
                        ${
                          selectedSlot === slot
                            ? "border-redy text-black"
                            : "border-gray-200 text-gray-700"
                        }
                    `}
        >
          <span className="text-[10px] text-redy">●</span>
          {slot}
        </button>
      ))}
    </div>
  );
}
