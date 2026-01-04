"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("confirmationData");
    if (data) {
      setConfirmationData(JSON.parse(data));
    } else {
      router.push("/courses");
    }
  }, [router]);

  if (!confirmationData) {
    return (
      <div className="min-h-screen flex items-center justify-center font-[dm_mono]">
        Loading...
      </div>
    );
  }

  const formatEventDetails = () => {
    if (confirmationData.courseType === "package") {
      return "Private Lesson Package – 4 Sessions (1 Hour Each)";
    }
    if (confirmationData.courseType === "private-lesson") {
      return "Private One-on-One Lesson – 1 Hour";
    }
    return "Monthly English Workshop – Group Session";
  };

  const formatWhen = () => {
    if (confirmationData.date) {
      return `${confirmationData.date} · ${confirmationData.time} (${confirmationData.timezone || "GMT"})`;
    }
    return "Scheduled time will be shared via email";
  };

  return (
    <div className="min-h-screen w-full bg-whitey font-[dm_mono] flex items-center justify-center px-4">
      <div className="w-full max-w-[520px] bg-white border border-gray-200 rounded-2xl px-8 py-10">
        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-redy"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-[22px] font-bold uppercase text-center text-blacky tracking-wide">
          This Event Is Scheduled
        </h1>

        <p className="mt-2 text-center text-[14px] text-gray-500 leading-relaxed">
          We sent an email with a calendar invitation with the details to
          everyone.
        </p>

        {/* DIVIDER */}
        <div className="my-8 border-t border-gray-200" />

        {/* DETAILS */}
        <div className="space-y-6">
          {/* WHAT */}
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <p className="text-[14px] font-bold uppercase text-blacky">What</p>
            <p className="text-[14px] text-gray-600 leading-relaxed">
              {formatEventDetails()}
            </p>
          </div>

          {/* WHEN */}
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <p className="text-[14px] font-bold uppercase text-blacky">When</p>
            <p className="text-[14px] text-gray-600">{formatWhen()}</p>
          </div>

          {/* WHO */}
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <p className="text-[14px] font-bold uppercase text-blacky">Who</p>
            <div className="space-y-3 text-[14px] text-gray-600">
              <div>
                <p>Irina Statham</p>
                <p>irinaxy2@gmail.com</p>
              </div>

              <div>
                <p>{confirmationData.name}</p>
                <p>{confirmationData.email}</p>
                <p>+{confirmationData.phone}</p>
              </div>
            </div>
          </div>

          {/* WHERE */}
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <p className="text-[14px] font-bold uppercase text-blacky">Where</p>
            <a
              href="https://meet.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-gray-600 hover:underline inline-flex items-center gap-2"
            >
              Google Meet
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-[13px] text-gray-500">
            Need to make a change?{" "}
            <button
              onClick={() => router.push("/courses")}
              className="font-semibold underline text-blacky hover:text-redy"
            >
              Reschedule
            </button>{" "}
            or{" "}
            <button
              onClick={() => router.push("/courses")}
              className="font-semibold underline text-blacky hover:text-redy"
            >
              Cancel
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
