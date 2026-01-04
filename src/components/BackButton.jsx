"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ onBack }) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mb-4 md:mb-8 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer inline-flex items-center w-fit"
      aria-label="Go back"
    >
      <ChevronLeft className="w-6 h-6 text-gray-500" />
    </button>
  );
}
