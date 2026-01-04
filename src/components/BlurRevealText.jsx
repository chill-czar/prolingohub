"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const BlurRevealText = ({ items: propItems }) => {
  const containerRef = useRef(null);
  const { t } = useLanguage();
  const items = propItems || t.blurRevealText.items;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = containerRef.current.querySelectorAll(".text-section");

      sections.forEach((section) => {
        const words = section.querySelectorAll(".word");

        // Set initial state for the new trendy look
        // Words start pushed down (yPercent: 100) and skewed (skewY)
        gsap.set(words, {
          transformOrigin: "bottom left",
          yPercent: 100,
          skewY: 8,
          opacity: 0,
          // Ensure old properties aren't affecting it
          scale: 1,
          rotationX: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%",
            scrub: true, // Keeping scrub: true for instant reaction like your original
            pin: true,
          },
        });

        // --- THE NEW TRENDY ANIMATION ---

        // 1. REVEAL (Enter from bottom, un-skewing)
        tl.to(words, {
          yPercent: 0,
          skewY: 0,
          opacity: 1,
          // Using your original stagger timings for consistency
          stagger: { amount: 0.6, ease: "power3.out" },
          ease: "power3.out",
          duration: 1,
        });

        // 2. HOLD CLEAN STATE (A slight pause in the middle of the scroll)
        tl.to({}, { duration: 0.5 });

        // 3. EXIT (Move UP and re-skew for a continuous flow)
        tl.to(words, {
          yPercent: -100, // Move up out of view
          skewY: -8, // Skew the opposite way for exit physics
          opacity: 0,
          // Using your original stagger timings for consistency
          stagger: { amount: 0.6, ease: "power2.in" },
          ease: "power2.in",
          duration: 1,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [items]); // Re-run animation if items change (language switch)

  return (
    <div ref={containerRef} className="w-full py-20">
      {items.map((item, index) => (
        <div
          key={index}
          className="text-section h-screen flex items-center justify-center px-4"
        >
          <h2 className="w-full md:w-1/2 leading-none text-4xl md:text-8xl font-bold text-black text-center uppercase">
            {item.split("\n").map((line, lineIndex) => (
              <div key={lineIndex} className="block">
                {line.split(" ").map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    // Important: This overflow-hidden is what makes the "mask" work
                    className="inline-block overflow-hidden align-bottom mr-4 pb-2"
                  >
                    <span className="word inline-block transform-gpu">
                      {word}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default BlurRevealText;
