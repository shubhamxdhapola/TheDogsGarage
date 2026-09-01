import React, { useRef, useCallback, useEffect, useState } from 'react';

export const ClickSpark = ({
  children,
  className = '',
  sparkColor = '#E86A2C',
  sparkSize = 10,
  sparkRadius = 30,
  sparkCount = 8,
  duration = 500,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  const createSparks = useCallback((x, y) => {
    const newSparks = [];
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 / sparkCount) * i + (Math.random() - 0.5) * 0.5;
      newSparks.push({
        x, y,
        vx: Math.cos(angle) * (sparkRadius / (duration / 16) + Math.random() * 2),
        vy: Math.sin(angle) * (sparkRadius / (duration / 16) + Math.random() * 2),
        life: 1,
        decay: (1 / (duration / 16)) * (0.8 + Math.random() * 0.4),
        size: sparkSize * (0.5 + Math.random() * 0.5),
      });
    }
    sparksRef.current = [...sparksRef.current, ...newSparks];
    if (!animFrameRef.current) animate();
  }, [sparkCount, sparkRadius, sparkSize, duration]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparksRef.current = sparksRef.current.filter(s => s.life > 0);

    sparksRef.current.forEach(spark => {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += 0.1;
      spark.life -= spark.decay;

      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
      ctx.fillStyle = sparkColor;
      ctx.globalAlpha = spark.life;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    if (sparksRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      animFrameRef.current = null;
    }
  }, [sparkColor]);

  const handleClick = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    createSparks(e.clientX - rect.left, e.clientY - rect.top);
  }, [createSparks]);

  return (
    <div ref={containerRef} className={`relative ${className || 'inline-block'}`} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />
      {children}
    </div>
  );
};

export default ClickSpark;
