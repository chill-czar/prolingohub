"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Calendar, User, Layers } from "lucide-react";

const CoursesScreen = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const courses = [
    {
      title: "MONTHLY ENGLISH WORKSHOP (1 HOUR)",
      tag: "LIVE GROUP LEARNING!",
      icon: <Calendar className="w-5 h-5 text-white" />,
      description:
        "A Focused Group Workshop To Strengthen Your English-Every Month.",
      features: [
        "1-HOUR LIVE GROUP WORKSHOP",
        "PRACTICAL SPEAKING ACTIVITIES",
        "REAL-TIME FEEDBACK",
        "MONTHLY THEMED SESSIONS",
        "SUITABLE FOR A2-B2 LEVELS",
        "PAY ONLY FOR THE SESSION YOU JOIN",
        "MEETING LINK SHARED AFTER BOOKING",
      ],
      price: "£68",
      color: "redy",
      cta: "Join Workshop",
      route: "/courses/workshop",
    },
    {
      title: "PRIVATE 1:1 LESSON (1 HOUR)",
      tag: "PERSONAL COACHING!",
      icon: <User className="w-5 h-5 text-white" />,
      description: "A Personalised Session Built Around Your Goals.",
      features: [
        "1-HOUR PRIVATE LESSON",
        "CHOOSE YOUR PREFERRED DATE & TIME",
        "CUSTOMISED LESSON PLAN",
        "REAL-TIME SPEAKING CORRECTION",
        "GREAT FOR INTERVIEWS & WORKPLACE ENGLISH",
        "EASY BOOKING",
      ],
      price: "£58",
      cta: "Book 1:1 Session",
      route: "/courses/private-lesson",
    },
    {
      title: "PRIVATE LESSON PACKAGE (4 LESSONS)",
      tag: "BEST VALUE!",
      icon: <Layers className="w-5 h-5 text-white" />,
      description:
        "A Structured Private Learning Plan Designed For Consistent Progress.",
      features: [
        "4x PERSONALISED 1-HOUR SESSIONS",
        "SAVE MORE COMPARED TO SINGLE LESSONS",
        "BOOK FOUR DIFFERENT DATES",
        "STRUCTURED IMPROVEMENT PATH",
        "PRIORITY ACCESS TO TIME SLOTS",
        "SESSION NOTES + PRACTICE RECOMMENDATIONS",
      ],
      price: "£199",
      originalPrice: "£232",
      save: "Save £33",
      cta: "Schedule 4 Sessions",
      route: "/courses/package",
    },
  ];

  return (
    <div className="h-dvh w-full bg-whitey font-[dm_mono] flex flex-col overflow-hidden animate-in fade-in duration-500 selection:bg-redy selection:text-whitey">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto md:overflow-hidden w-full">
        <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-full flex flex-col">
          {/* Back Button */}
          <div>
            <button
              onClick={handleBack}
              className="mb-4 md:mb-8 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer inline-flex items-center"
            >
              <ChevronLeft className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-10 md:mb-14 space-y-2 md:space-y-4 px-4 shrink-0">
            <h1 className="text-2xl md:text-4xl font-bold text-blacky uppercase tracking-tight leading-tight">
              CHOOSE HOW YOU WANT TO LEARN.
            </h1>
            <p className="text-gray-500 text-xs md:text-lg uppercase tracking-wide font-medium md:leading-none">
              Find The Session That Fits Your Schedule, Learning Style And
              Goals.
            </p>
          </div>

          {/* Grid */}
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-2 grow">
            {courses.map((course, index) => (
              <div
                key={index}
                className="group bg-whitey border max-h-[550px] border-gray-200 rounded-2xl
  p-5 flex flex-col h-full
  shadow-[0_1px_6px_rgba(0,0,0,0.04)]
  hover:shadow-[0_10px_20px_-8px_rgba(220,38,38,0.22)]
  hover:border-red-100 transition-all duration-300 relative"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-base md:text-lg font-bold leading-snug w-3/4 uppercase">
                    {course.title}
                  </h2>

                  <div className="bg-redy p-1.5 rounded-lg shadow-sm shrink-0">
                    {course.icon}
                  </div>
                </div>

                {/* Tag */}
                <div className="flex justify-between items-center mb-4 h-5">
                  {course.tag && (
                    <span className="bg-redy text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wide">
                      {course.tag}
                    </span>
                  )}

                  {course.save && (
                    <span className="text-xs font-bold text-blacky">
                      {course.save}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t-2 border-dashed border-gray-100 my-2"></div>

                {/* Description */}
                <p className="text-gray-600 text-[11px] md:text-xs my-3 font-medium leading-relaxed min-h-[36px]">
                  {course.description}
                </p>

                {/* Features */}
                <ul className="space-y-1.5 mb-6 flex-1">
                  {course.features.map((feature, i) => (
                    <li
                      key={i}
                      className="text-[11px] md:text-xs text-gray-500 flex items-start gap-2 font-medium leading-snug"
                    >
                      <span className="mt-1 block w-2 h-2 scale-90 bg-gray-400 rounded-[2px] shrink-0" />
                      <span className="block">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mt-auto mb-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-bold text-blacky block">
                      {course.price}
                    </span>

                    {course.originalPrice && (
                      <span className="text-xl md:text-2xl text-gray-200 line-through font-bold">
                        {course.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => router.push(course.route)}
                  className="w-full bg-redy text-white font-bold py-2.5 px-4 rounded-lg
  hover:bg-red-700 transition-colors uppercase text-xs md:text-sm
  cursor-pointer shadow-md active:scale-[0.98]"
                >
                  {course.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesScreen;
