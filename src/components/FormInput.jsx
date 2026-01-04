"use client";

export default function FormInput({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
  value,
  onChange,
  error = "",
}) {
  const isError = Boolean(error);

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-xs font-semibold uppercase tracking-wide text-blacky"
      >
        {label}
        {required && <span className="text-redy"> *</span>}
        {isError && <span className="ml-1 text-redy">({error})</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-md text-sm outline-none transition
                    border
                    ${
                      isError
                        ? "border-redy focus:ring-redy"
                        : "border-gray-200 focus:ring-redy"
                    }
                    focus:ring-2 focus:border-transparent
                `}
      />
    </div>
  );
}
