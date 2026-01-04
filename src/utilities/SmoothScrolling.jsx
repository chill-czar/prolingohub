"use client";
import { ReactLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

function SmoothScrolling({ children }) {
  const lenisRef = useRef();

  useEffect(() => {
    // Force scroll to top on page reload
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;
