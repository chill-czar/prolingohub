"use client";

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  variant = "primary",
  size = "md",
  type = "button",
}) {
  const baseStyles =
    "font-bold rounded-lg transition-all duration-200 active:scale-[0.98] uppercase tracking-wide cursor-pointer";

  const variantStyles = {
    primary:
      "bg-redy text-whitey hover:bg-[#d32f2f] shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-white text-redy border-2 border-redy hover:bg-gray-50",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle}`}
    >
      {children}
    </button>
  );
}
