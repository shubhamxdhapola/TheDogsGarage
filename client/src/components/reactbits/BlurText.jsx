import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const BlurText = ({
  text = '',
  delay = 100,
  animateBy = 'words',
  direction = 'top',
  className = '',
  threshold = 0.1,
  rootMargin = '0px',
  onAnimationComplete,
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

  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  const getDirection = () => {
    switch (direction) {
      case 'top': return { y: -15 };
      case 'bottom': return { y: 15 };
      case 'left': return { x: -15 };
      case 'right': return { x: 15 };
      default: return { y: -15 };
    }
  };

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, ...getDirection() }}
          animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0, x: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: i * (delay / 1000),
            ease: [0.25, 0.1, 0.25, 1],
          }}
          onAnimationComplete={i === elements.length - 1 ? onAnimationComplete : undefined}
          className="inline-block"
          style={{ marginRight: animateBy === 'words' ? '0.3em' : undefined }}
        >
          {el}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;
