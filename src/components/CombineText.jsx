"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const CombineText = () => {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const arrowRef = useRef(null);
  const arrowHeadRef = useRef(null);
  const ctaTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const words = textRef.current.querySelectorAll(".word");

      mm.add("(min-width: 768px)", () => {
        // Desktop Animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=300%", // Increased scroll distance
            scrub: 1,
            pin: true,
          },
        });

        // Initial scattered states (Desktop)
        // All these start at time 0 and end at time 1 (default duration 0.5, but we can sync them)
        // We want them to finish halfway through the scroll.
        // So we'll set duration: 1 for all, and start at 0.
        // Then the next animation starts at 1.

        const scatterConfig = { duration: 1 };

        tl.from(
          words[0],
          {
            xPercent: -150,
            yPercent: -150,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );
        tl.from(
          words[2],
          {
            xPercent: 150,
            yPercent: -100,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );
        tl.from(
          words[3],
          {
            xPercent: 200,
            yPercent: 50,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );
        tl.from(
          words[4],
          {
            xPercent: -150,
            yPercent: 150,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );
        tl.from(
          words[5],
          {
            yPercent: 200,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );
        tl.from(
          words[6],
          {
            xPercent: 150,
            yPercent: 150,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );

        // Arrow and CTA Animation
        // Starts after text assembly (at time 1)
        tl.fromTo(
          ctaTextRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          1.2, // Small delay after text assembles
        );

        tl.fromTo(
          arrowRef.current,
          { strokeDashoffset: 1000 }, // Assuming path length is < 1000
          { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" },
          1.5, // Start drawing shortly after text appears
        );

        tl.to(
          arrowHeadRef.current,
          { opacity: 1, duration: 0.3 },
          2.4, // Show arrowhead near end of draw
        );

        // Fade out everything at the end
        tl.to(
          [ctaTextRef.current, arrowRef.current, arrowHeadRef.current],
          { opacity: 0, duration: 0.5 },
          3.5, // Start fading out before unpinning
        );
      });

      mm.add("(max-width: 767px)", () => {
        // Mobile Animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=300%",
            scrub: 1,
            pin: true,
          },
        });

        const scatterConfig = { duration: 1 };

        // Initial scattered states (Mobile)
        tl.from(
          words[0],
          {
            xPercent: -75,
            yPercent: -75,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );
        tl.from(
          words[2],
          {
            xPercent: 75,
            yPercent: -50,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );
        tl.from(
          words[3],
          {
            xPercent: 100,
            yPercent: 25,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );
        tl.from(
          words[4],
          {
            xPercent: -75,
            yPercent: 75,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );
        tl.from(
          words[5],
          {
            yPercent: 100,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );
        tl.from(
          words[6],
          {
            xPercent: 75,
            yPercent: 75,
            filter: "blur(7.5px)",
            opacity: 0.8,
            ...scatterConfig,
          },
          0,
        );

        // Arrow and CTA Animation (Mobile)
        tl.fromTo(
          ctaTextRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          1.2,
        );

        tl.fromTo(
          arrowRef.current,
          { strokeDashoffset: 1000 },
          { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" },
          1.5,
        );

        tl.to(arrowHeadRef.current, { opacity: 1, duration: 0.3 }, 2.4);

        // Fade out everything at the end (Mobile)
        tl.to(
          [ctaTextRef.current, arrowRef.current, arrowHeadRef.current],
          { opacity: 0, duration: 0.5 },
          3.5,
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full flex items-center justify-center overflow-hidden uppercase"
    >
      <div
        ref={textRef}
        className="flex flex-col items-center justify-center text-5xl md:text-7xl font-bold text-black leading-tight text-center"
      >
        <div className="flex flex-wrap justify-center gap-x-2 md:gap-x-4 gap-y-2 leading-tight">
          {t.combineText.line1.map((word, index) => (
            <span key={`line1-${index}`} className="word inline-block">
              {word}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-2 md:gap-x-4 gap-y-2 leading-none">
          {t.combineText.line2.map((word, index) => (
            <span key={`line2-${index}`} className="word inline-block">
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="absolute bottom-16 right-22 flex flex-col items-end pointer-events-none z-20">
        <div
          ref={ctaTextRef}
          className="font-[supfont] text-2xl md:text-4xl text-center text-redy -mb-4 md:-mb-8 mr-20 md:mr-42 origin-bottom-right capitalize"
        >
          {t.combineText.cta}
        </div>

        <svg
          width="180"
          height="120"
          viewBox="0 0 180 120"
          className="w-24 h-16 md:w-48 md:h-32 text-redy translate-x-4"
          style={{ overflow: "visible" }}
        >
          <path
            ref={arrowRef}
            d="M 20 10 C 60 10, 150 10, 150 50 C 150 80, 100 80, 100 50 C 100 20, 160 80, 160 110"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1000"
            strokeDashoffset="1000"
          />
          <path
            ref={arrowHeadRef}
            d="M 145 100 L 160 110 L 170 95"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0 }}
          />
        </svg>
      </div>
    </div>
  );
};

export default CombineText;
