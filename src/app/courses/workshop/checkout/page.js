"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import BookingForm from "@/components/BookingForm";
import { Clock } from "lucide-react";

export default function WorkshopCheckoutPage() {
  const router = useRouter();

  const workshopData = {
    title: "MONTHLY ENGLISH WORKSHOP",
    description:
      "DIVE INTO HANDS-ON LEARNING! OUR WORKSHOP LETS CURIOUS MINDS EXPLORE, EXPERIMENT, AND EXCEL IN [SPECIFIC FIELD/TOPIC], WHETHER YOU'RE A BEGINNER OR AIMING TO SHARPEN YOUR SKILLS.",
    date: "08 OCT 2025",
    time: "10:00 - 11:00 AM",
    timezone: "GMT",
    duration: "1h",
    price: 68,
  };

  const handleSubmit = (formData) => {
    sessionStorage.setItem(
      "confirmationData",
      JSON.stringify({ ...workshopData, ...formData }),
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
                  Workshop Summary
                </p>

                <h1 className="text-[22px] font-bold uppercase text-black mb-4">
                  {workshopData.title}
                </h1>

                <p className="text-[14px] leading-relaxed text-gray-500 mb-6">
                  {workshopData.description}
                </p>

                <p className="text-[12px] font-bold uppercase text-gray-600 mb-3">
                  Your Selected Slot | {workshopData.timezone}
                </p>

                <div className="rounded-lg border border-dashed border-gray-200 p-4 mb-8 w-fit bg-[#FDFDFD]">
                  <div className="flex items-center gap-2 text-[14px] text-black">
                    <span>
                      {workshopData.date}, {workshopData.time}
                    </span>
                  </div>

                  <div className="mt-2 text-[13px] flex gap-2 items-center">
                    <Clock className="h-4 w-4 " /> {workshopData.duration}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[44px] font-bold text-redy leading-none">
                  £{workshopData.price}
                </p>
                <p className="mt-2 text-[12px] uppercase text-gray-500">
                  1 seat reserved for you.
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
