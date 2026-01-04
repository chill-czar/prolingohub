"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import BookingForm from "@/components/BookingForm";
import { Clock } from "lucide-react";

export default function PackageCheckoutPage() {
  const router = useRouter();
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("bookingData");
    if (!storedData) {
      router.push("/courses/package");
      return;
    }

    setPackageData(JSON.parse(storedData));
  }, [router]);

  if (!packageData) return null;

  const courseInfo = {
    title: "PRIVATE LESSON PACKAGE (4 LESSONS) – 1 HOUR",
    description:
      "Accelerate your progress with 4 personalized 1-on-1 sessions, tailored specifically to your level for maximum results.",
    timezone: "GMT",
    duration: "1h",
    price: packageData.price,
  };

  const formatSlot = (slot) => {
    const date = new Date(slot.date);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    return `${days[date.getDay()]} ${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}, ${slot.time}`;
  };

  const handleSubmit = (formData) => {
    sessionStorage.setItem(
      "confirmationData",
      JSON.stringify({
        ...courseInfo,
        slots: packageData.slots,
        ...formData,
      }),
    );

    router.push("/confirmation");
  };

  return (
    <div className="bg-[#FDFDFD] font-[dm_mono]">
      <div className="mx-auto h-screen flex flex-col max-w-[1240px] px-6 py-8">
        <BackButton />

        {/* OUTER CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0fr_1.2fr]">
            {/* LEFT SUMMARY */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <p className="text-[12px] uppercase tracking-wide text-gray-400 mb-3">
                  Meet Summary
                </p>

                <h1 className="text-[22px] font-bold uppercase text-black mb-4">
                  {courseInfo.title}
                </h1>

                <p className="text-[14px] leading-relaxed text-gray-500 mb-6">
                  {courseInfo.description}
                </p>

                <p className="text-[12px] font-bold uppercase text-gray-600 mb-3">
                  Your Selected Slots | {courseInfo.timezone}
                </p>

                <div className="rounded-lg w-fit border border-dashed border-gray-200 p-4 mb-8 bg-[#FDFDFD] space-y-2">
                  {packageData.slots.map((slot, index) => (
                    <div key={index} className="text-[14px] text-black">
                      {formatSlot(slot)}
                    </div>
                  ))}

                  <div className="pt-2 text-[13px] flex gap-2 items-center text-gray-600">
                    <Clock className="h-4 w-4" />
                    {courseInfo.duration} per lesson
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[44px] font-bold text-redy leading-none">
                  £{courseInfo.price}
                </p>
                <p className="mt-2 text-[12px] uppercase text-gray-500">
                  Secure your private lessons now.
                </p>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="hidden lg:block w-px bg-gray-200" />

            {/* RIGHT FORM */}
            <div className="p-8">
              <BookingForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
