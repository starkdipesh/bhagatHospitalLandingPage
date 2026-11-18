import { useEffect, useRef, useState } from 'react';

export function useVelocitySkew(velocity: number) {
  const [skew, setSkew] = useState(0);
  const currentSkewRef = useRef(0);

  useEffect(() => {
    // Clamp velocity to prevent excessive distortion
    const targetSkew = Math.max(-1.25, Math.min(1.25, velocity * 0.08));
    
    let animId: number;
    const lerp = () => {
      // Smooth dampening
      currentSkewRef.current += (targetSkew - currentSkewRef.current) * 0.12;
      setSkew(currentSkewRef.current);

      if (Math.abs(targetSkew - currentSkewRef.current) > 0.01) {
        animId = requestAnimationFrame(lerp);
      }
    };

    animId = requestAnimationFrame(lerp);

    return () => cancelAnimationFrame(animId);
  }, [velocity]);

  return {
    style: {
      transform: `skewY(${skew.toFixed(2)}deg)`,
      transition: 'transform 0.05s ease-out'
    },
    skewValue: skew
  };
}
