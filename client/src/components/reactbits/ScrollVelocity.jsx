import React, { useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

export const ScrollVelocity = ({
  texts = ['The Dogs Garage'],
  defaultVelocity = 1,
  className = '',
  numCopies = 6,
}) => {
  const containerRef = useRef(null);
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();

  // Use a ref to track the animation frame
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const velocity = useMotionValue(0);

  const smoothVelocity = useSpring(velocity, {
    damping: 50,
    stiffness: 200,
  });

  // Animate the marquee
  React.useEffect(() => {
    let animId;
    const animate = () => {
      const now = Date.now();
      const currentScrollY = scrollY.get();
      const dt = Math.max(now - lastTime.current, 1);
      const scrollDelta = currentScrollY - lastScrollY.current;
      const currentVelocity = scrollDelta / dt;

      velocity.set(currentVelocity);
      lastScrollY.current = currentScrollY;
      lastTime.current = now;

      // Move base position
      const moveBy = defaultVelocity * 0.5 + smoothVelocity.get() * 50;
      baseX.set(baseX.get() - moveBy);

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [defaultVelocity, scrollY, velocity, smoothVelocity, baseX]);

  const repeatedTexts = Array.from({ length: numCopies }, (_, i) =>
    texts.map((t, j) => (
      <span key={`${i}-${j}`} className="mx-8 whitespace-nowrap">
        {t}
      </span>
    ))
  ).flat();

  return (
    <div ref={containerRef} className="overflow-hidden whitespace-nowrap">
      <motion.div
        className={`inline-flex items-center ${className}`}
        style={{
          x: useTransform(baseX, (v) => {
            // Reset when moved too far
            const containerWidth = containerRef.current?.scrollWidth || 3000;
            const halfWidth = containerWidth / 2;
            return v % halfWidth;
          }),
        }}
      >
        {repeatedTexts}
        {repeatedTexts}
      </motion.div>
    </div>
  );
};

export default ScrollVelocity;
