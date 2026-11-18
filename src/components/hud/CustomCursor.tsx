import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const trailingRef = useRef({ x: -100, y: -100 });
  const mouseRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Detect touch
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });

      // Check for custom hover data
      const target = e.target as HTMLElement | null;
      const hoverEl = target?.closest('[data-cursor]');
      if (hoverEl) {
        const text = hoverEl.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Smooth trailing animation loop
    let animId: number;
    const animateTrailing = () => {
      trailingRef.current.x += (mouseRef.current.x - trailingRef.current.x) * 0.18;
      trailingRef.current.y += (mouseRef.current.y - trailingRef.current.y) * 0.18;
      setTrailingPos({ x: trailingRef.current.x, y: trailingRef.current.y });
      animId = requestAnimationFrame(animateTrailing);
    };
    animId = requestAnimationFrame(animateTrailing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Central pinpoint */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        <div className={`w-2 h-2 rounded-full ${isHovered ? 'bg-hospital-cyanGlow' : 'bg-hospital-cyan'} shadow-glow-cyan-sm`} />
      </div>

      {/* Trailing elastic circle / action ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-300 ${
            isHovered
              ? 'w-20 h-20 bg-hospital-cyan/15 border-hospital-cyan text-[10px] font-mono-hud text-hospital-cyanGlow uppercase font-bold tracking-widest backdrop-blur-xs scale-100'
              : 'w-8 h-8 border-hospital-cyan/40 scale-75'
          }`}
        >
          {cursorText && (
            <span className="animate-fade-in text-center px-1">
              {cursorText}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

