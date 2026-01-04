"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const SlideText = () => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const { t, language } = useLanguage();
  const text = t.slideText.word; // "Book"
  const copies = 15; // Increased copies

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = wrapperRef.current;
      const lines = wrapper.querySelectorAll(".word-line");
      const lastLine = lines[lines.length - 1];

      // Select all characters from all lines except the last one
      const otherChars = wrapper.querySelectorAll(
        ".word-line:not(:last-child) .char",
      );

      // Get characters of the last word
      const lastLineChars = lastLine.querySelectorAll(".char");

      const charsToHide = [];
      const charsToKeep = [];

      if (language === "en" && text === "Book") {
        lastLineChars.forEach((char, index) => {
          if (index >= 2)
            charsToKeep.push(char); // 'o', 'k'
          else charsToHide.push(char); // 'B', 'o'
        });
      } else {
        lastLineChars.forEach((char) => charsToKeep.push(char));
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%", // Increased scroll distance for more time
          scrub: 1,
          pin: true,
        },
      });

      // 1. Move up
      tl.to(
        wrapper,
        {
          y: () => {
            return -1 * (wrapper.offsetHeight / 2 - lastLine.offsetHeight / 2);
          },
          duration: 3.2, // Relative duration in timeline
          ease: "none",
        },
        0,
      );

      // 2. Character by character color change then fade
      // We want them to turn red then disappear.

      // Turn Red
      tl.to(
        otherChars,
        {
          color: "#DC2626",
          duration: 0.1,
          stagger: {
            each: 0.02,
            from: "start", // Start from top
          },
        },
        0.5,
      ); // Start slightly after movement begins

      // Fade Out (slightly delayed after color change)
      tl.to(
        otherChars,
        {
          opacity: 0,
          duration: 0.1,
          stagger: {
            each: 0.05,
            from: "start",
          },
        },
        0.6,
      ); // Overlap slightly with color change

      // 3. Transform "Book" to "ok" (if English)
      if (charsToHide.length > 0) {
        // First turn them red
        tl.to(
          charsToHide,
          {
            color: "#DC2626",
            duration: 0.5,
          },
          2.5,
        );

        // Then fade out and collapse
        tl.to(
          charsToHide,
          {
            opacity: 0,
            width: 0,
            margin: 0,
            padding: 0,
            duration: 2,
            ease: "power2.inOut",
          },
          3,
        );
      }

      // 4. Scale up the remaining "ok"
      tl.to(
        lastLine,
        {
          scale: 8.2,
          duration: 2,
          ease: "power2.inOut",
          transformOrigin: "center center",
        },
        ">",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [language, text]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full flex items-center justify-center overflow-hidden uppercase"
    >
      <div
        ref={wrapperRef}
        className="flex flex-col items-center justify-center gap-0" // Removed gap
      >
        {Array.from({ length: copies }).map((_, i) => (
          <div
            key={i}
            className={`word-line flex text-6xl md:text-9xl font-bold leading-none tracking-tight transition-colors duration-300 ${
              i === copies - 1 ? "text-black" : "text-black"
            }`}
          >
            {text.split("").map((char, index) => (
              <span key={index} className="char inline-block">
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideText;
