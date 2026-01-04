"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { Calendar, Loader2 } from "lucide-react";

export default function WorkshopPage() {
  const router = useRouter();
  const [workshopData, setWorkshopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNextWorkshop = async () => {
      try {
        const res = await fetch("/api/workshops/next");
        const response = await res.json();

        if (response.success && response.data) {
          // Transform API data to expected format
          const workshop = response.data;
          const dateObj = new Date(workshop.date);
          const startTimeObj = new Date(`2000-01-01T${workshop.startTime}`);
          const endTimeObj = new Date(`2000-01-01T${workshop.endTime}`);

          setWorkshopData({
            title: workshop.title || "MONTHLY ENGLISH WORKSHOP",
            duration: "(1 HOUR)",
            description: workshop.description || "A Focused Group Workshop To Strengthen Your English—Every Month.",
            date: dateObj.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            time: `${startTimeObj.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })} - ${endTimeObj.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}`,
            timezone: "GMT",
            price: 68, // Keep fixed price for now
            seatsLeft: workshop.capacity || 12, // Use capacity as seats left approximation
            whatYouLearn: [
              "ENGAGE IN PRACTICAL SPEAKING ACTIVITIES",
              "RECEIVE REAL-TIME FEEDBACK FROM THE INSTRUCTOR",
              "IMPROVE FLUENCY THROUGH THEMED SESSIONS",
              "SUITABLE FOR ALL LEVELS (A2-B2)",
            ],
            aboutWorkshop: workshop.description || "DIVE INTO HANDS-ON LEARNING! OUR WORKSHOP LETS CURIOUS MINDS EXPLORE, EXPERIMENT, AND EXCEL IN ENGLISH, WHETHER YOU'RE A BEGINNER OR AIMING TO SHARPEN YOUR SKILLS.",
            workshopId: workshop._id, // Store for booking
          });
        } else {
          setError(response.message || "No upcoming workshops available");
        }
      } catch (err) {
        console.error("Failed to fetch workshop:", err);
        setError("Failed to load workshop details");
      } finally {
        setLoading(false);
      }
    };

    fetchNextWorkshop();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] font-[dm_mono] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-redy" />
          <p className="text-gray-600 uppercase text-sm">Loading workshop details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] font-[dm_mono]">
        <div className="mx-auto flex flex-col h-screen max-w-[1240px] px-6 py-8">
          <BackButton />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 uppercase mb-4">
                Workshop Unavailable
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => router.push("/courses")}
                className="bg-redy text-white px-6 py-3 rounded-lg font-bold uppercase text-sm hover:bg-red-700 transition-colors"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workshopData) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] font-[dm_mono]">
        <div className="mx-auto flex flex-col h-screen max-w-[1240px] px-6 py-8">
          <BackButton />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 uppercase mb-4">
                No Upcoming Workshops
              </h2>
              <p className="text-gray-600 mb-6">
                There are no workshops scheduled at the moment. Please check back later.
              </p>
              <button
                onClick={() => router.push("/courses")}
                className="bg-redy text-white px-6 py-3 rounded-lg font-bold uppercase text-sm hover:bg-red-700 transition-colors"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-[dm_mono]">
      <div className="mx-auto flex flex-col h-screen max-w-[1240px] px-6 py-8">
        <BackButton />

        {/* HEADER */}
        <div className="mt-6 max-w-3xl">
          <h1 className="text-[30px] font-bold uppercase text-black leading-tight">
            {workshopData.title}{" "}
            <span className="text-[15px] font-normal text-gray-500">
              {workshopData.duration}
            </span>
          </h1>

          <p className="mt-2 text-[15px] text-gray-500">
            {workshopData.description}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-[14px] text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {workshopData.date} · {workshopData.time} ({workshopData.timezone}
              )
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="mt-8 h-full grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
          {/* LEFT CARD */}
          <div className="rounded-2xl border h-full border-gray-200 bg-white">
            <div className="p-6 h-1/2">
              <h2 className="text-[15px] font-bold uppercase text-black mb-4">
                What You’ll Learn
              </h2>

              <ul className="space-y-3">
                {workshopData.whatYouLearn.map((item, i) => (
                  <li key={i} className="flex gap-2 text-[14px] text-gray-600">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 mx-6" />

            <div className="p-6">
              <h2 className="text-[15px] font-bold uppercase text-black mb-4">
                About the Workshop
              </h2>
              <p className="text-[14px] leading-relaxed text-gray-600">
                {workshopData.aboutWorkshop}
              </p>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="lg:sticky lg:top-8 h-full">
            <div className="rounded-2xl border h-full border-gray-200 bg-white p-6 flex flex-col justify-between">
              <div>
                <div className="mb-5">
                  <div className="inline-flex rounded-lg bg-redy p-3">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </div>

                <p className="text-[15px] font-bold uppercase text-black">
                  {workshopData.date}
                </p>
                <p className="text-[14px] text-gray-500">
                  {workshopData.time} ({workshopData.timezone})
                </p>

                <div className="my-6 border-t border-dashed border-gray-200" />
              </div>

              <div>
                <p className="text-[42px] font-bold text-black leading-none">
                  £{workshopData.price}
                </p>
                <p className="mt-2 text-[14px] font-semibold uppercase text-gray-600">
                  {workshopData.seatsLeft} Seats Left
                </p>

                <div className="mt-6">
                  <PrimaryButton
                    fullWidth
                    onClick={() => router.push(`/courses/workshop/checkout?workshopId=${workshopData.workshopId}`)}
                  >
                    Join Workshop
                  </PrimaryButton>
                </div>

                <p className="mt-4 text-[12px] uppercase text-gray-400 leading-snug">
                  Once booked, workshop details will be sent to your email
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
