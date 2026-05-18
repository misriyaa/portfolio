import React, { useLayoutEffect, useRef } from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

// ✅ Named export
export const ScrollStackItem = ({ children, itemClassName = "" }) => {
  return (
    <div className={`scroll-stack-card ${itemClassName}`}>
      {children}
    </div>
  );
};

// ✅ Default export
const ScrollStack = ({ children }) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.1,
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleScroll = () => {
      const cards =
        containerRef.current.querySelectorAll(".scroll-stack-card");

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const trigger = window.innerHeight * 0.1;

        if (rect.top <= trigger) {
          const progress = Math.min(
            1,
            Math.abs(rect.top - trigger) / window.innerHeight
          );

          const scale = 1 - progress * 0.08;
          const brightness = 1 - progress * 0.3;

          card.style.transform = `scale(${scale})`;
          card.style.filter = `brightness(${brightness})`;
        } else {
          card.style.transform = "scale(1)";
          card.style.filter = "brightness(1)";
        }
      });
    };

    lenis.on("scroll", handleScroll);

    return () => lenis.destroy();
  }, []);

  return (
    <div ref={containerRef} className="scroll-stack-scroller">
      <div className="scroll-stack-inner">{children}</div>
    </div>
  );
};

export default ScrollStack;