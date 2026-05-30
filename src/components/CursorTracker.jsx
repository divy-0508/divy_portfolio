import { useEffect, useRef } from "react";

export default function CursorTracker() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);

    let raf;
    function animate() {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      }
      raf = requestAnimationFrame(animate);
    }
    animate();

    // Scale ring on hover over interactive elements
    const addBig = e => { if (ringRef.current) { ringRef.current.style.width = "52px"; ringRef.current.style.height = "52px"; ringRef.current.style.marginLeft = "-26px"; ringRef.current.style.marginTop = "-26px"; ringRef.current.style.borderColor = "#5C8C5A"; ringRef.current.style.opacity = "0.7"; } };
    const addSmall = e => { if (ringRef.current) { ringRef.current.style.width = "36px"; ringRef.current.style.height = "36px"; ringRef.current.style.marginLeft = "0"; ringRef.current.style.marginTop = "0"; ringRef.current.style.borderColor = "#C4895A"; ringRef.current.style.opacity = "0.5"; } };

    document.querySelectorAll("a, button, [style*='cursor: pointer']").forEach(el => {
      el.addEventListener("mouseenter", addBig);
      el.addEventListener("mouseleave", addSmall);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Hide on touch devices
  if (window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      {/* Dot */}
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99999, pointerEvents: "none",
        width: 8, height: 8, borderRadius: "50%", background: "#5C8C5A",
        transition: "background 0.2s", willChange: "transform",
      }} />
      {/* Ring */}
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99998, pointerEvents: "none",
        width: 36, height: 36, borderRadius: "50%",
        border: "1.5px solid #C4895A", opacity: 0.5,
        transition: "width 0.2s, height 0.2s, border-color 0.2s, opacity 0.2s",
        willChange: "transform",
      }} />
    </>
  );
}