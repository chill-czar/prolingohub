"use client";

export default function FormTextarea({
  label,
  name,
  required = false,
  placeholder = "",
  value,
  onChange,
  rows = 4,
  maxLength,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-xs font-semibold uppercase tracking-wide text-blacky"
      >
        {label}{" "}
        {!required && <span className="text-gray-400 font-normal"></span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-redy focus:border-transparent resize-none"
      />
      {maxLength && (
        <p className="text-xs text-gray-400 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}
