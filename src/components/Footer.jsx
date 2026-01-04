"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const iRef = useRef(null);
  const heartRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%", // Start when footer is visible
          toggleActions: "play none none none", // Play once
        },
      });

      // 1. "I" and "ProlingualHub" slide in from sides
      tl.from(
        iRef.current,
        {
          xPercent: -200,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "start",
      );

      tl.from(
        textRef.current,
        {
          xPercent: 200,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "start",
      );

      // 2. Heart comes up from bottom
      tl.from(
        heartRef.current,
        {
          yPercent: 200,
          opacity: 0,
          scale: 0,
          duration: 0.8,
          ease: "back.out(1.7)", // Bouncy arrival
        },
        "-=0.6",
      ); // Start before text finishes

      // 3. Impact/Push effect (The "khiskayega" part)
      // As heart lands, push text outwards and bounce back
      tl.to(
        iRef.current,
        {
          x: -40,
          duration: 0.1,
          ease: "power1.out",
        },
        "-=0.2",
      ); // Sync with heart landing

      tl.to(
        textRef.current,
        {
          x: 40,
          duration: 0.1,
          ease: "power1.out",
        },
        "<",
      );

      // Return to normal (Bounce back)
      tl.to(iRef.current, {
        x: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)",
      });

      tl.to(
        textRef.current,
        {
          x: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
        },
        "<",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden uppercase"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-4xl md:text-7xl font-bold text-black text-center">
        <span ref={iRef} className="inline-block">
          {t.footer.i}
        </span>
        <span
          ref={heartRef}
          className="inline-block origin-center text-red-500"
        >
          ❤️
        </span>
        <span ref={textRef} className="inline-block">
          ProlingualHub
        </span>
      </div>

      {/* Contact Info */}
      <div className="absolute font-normal bottom-10 left-4 md:left-10 text-gray-500 text-xs md:text-base space-y-1">
        <p>{t.footer.contact.email}</p>
        <p>{t.footer.contact.phone}</p>
        <p>{t.footer.contact.linkedin}</p>
      </div>
    </div>
  );
};

export default Footer;
