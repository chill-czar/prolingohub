"use client";

export default function FormSelect({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  placeholder = "Select an option",
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-xs font-semibold uppercase tracking-wide text-blacky"
      >
        {label} {required && <span className="text-redy">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-redy focus:border-transparent bg-white cursor-pointer uppercase text-gray-500"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
