"use client";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useEffect, useRef } from "react";

gsap.registerPlugin(TextPlugin);

const TypingText = ({
  text,
  speed = 1,
  delay = 3,
  className = "",
  cursor = true,
}) => {
  const textRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });

    // Typing animation
    tl.to(textRef.current, {
      duration: text.length * 0.1 * (1 / speed),
      text: text,
      ease: "none",
    });

    // Stay for 0.6 seconds
    tl.to({}, { duration: 0.6 });

    // Clear text immediately
    tl.set(textRef.current, { text: "" });

    // Cursor blinking animation
    if (cursor) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }

    return () => {
      tl.kill();
      gsap.killTweensOf(cursorRef.current);
    };
  }, [text, speed, delay, cursor]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="invisible">&#8203;</span>
      <span ref={textRef}></span>
      {cursor && (
        <span
          ref={cursorRef}
          className="ml-1 w-[2px] h-[1em] bg-current inline-block"
        ></span>
      )}
    </span>
  );
};

export default TypingText;
