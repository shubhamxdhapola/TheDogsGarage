import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const SplitText = ({
  text = '',
  className = '',
  delay = 50,
  animationFrom = { opacity: 0, y: 20, filter: 'blur(6px)' },
  animationTo = { opacity: 1, y: 0, filter: 'blur(0px)' },
  easing = [0.25, 0.1, 0.25, 1],
  threshold = 0.1,
  rootMargin = '0px',
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const words = text.split(' ');

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex" style={{ marginRight: '0.3em' }}>
          {word.split('').map((char, charIndex) => {
            const globalIndex = words.slice(0, wordIndex).join(' ').length + charIndex + (wordIndex > 0 ? 1 : 0);
            return (
              <motion.span
                key={charIndex}
                initial={animationFrom}
                animate={inView ? animationTo : animationFrom}
                transition={{
                  duration: 0.35,
                  delay: globalIndex * (delay / 1000),
                  ease: easing,
                }}
                onAnimationComplete={
                  wordIndex === words.length - 1 && charIndex === word.length - 1
                    ? onLetterAnimationComplete
                    : undefined
                }
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </p>
  );
};

export default SplitText;
