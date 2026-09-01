import React, { useRef, useEffect, useState, useCallback } from 'react';

export const CountUp = ({
  from = 0,
  to = 100,
  duration = 2,
  className = '',
  separator = ',',
  decimals = 0,
  prefix = '',
  suffix = '',
  onEnd,
}) => {
  const ref = useRef(null);
  const [count, setCount] = useState(from);
  const [started, setStarted] = useState(false);

  const formatNumber = useCallback((num) => {
    const fixed = num.toFixed(decimals);
    if (!separator) return `${prefix}${fixed}${suffix}`;
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return `${prefix}${parts.join('.')}${suffix}`;
  }, [separator, decimals, prefix, suffix]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(to);
        onEnd?.();
      }
    };

    requestAnimationFrame(animate);
  }, [started, from, to, duration, onEnd]);

  return (
    <span ref={ref} className={className}>
      {formatNumber(count)}
    </span>
  );
};

export default CountUp;
