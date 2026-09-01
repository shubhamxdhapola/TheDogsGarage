import React from 'react';

export const GradientText = ({
  children,
  className = '',
  colors = ['#E86A2C', '#F3B63F', '#E86A2C'],
  animationSpeed = 4,
  showBorder = false,
}) => {
  const gradientStr = colors.join(', ');

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientStr})`,
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: `gradient-shift ${animationSpeed}s ease infinite`,
      }}
    >
      {showBorder && (
        <span
          className="absolute inset-0 rounded-lg -z-10"
          style={{
            background: `linear-gradient(135deg, ${gradientStr})`,
            backgroundSize: '200% 200%',
            animation: `gradient-shift ${animationSpeed}s ease infinite`,
            padding: '2px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
          }}
        />
      )}
      {children}
    </span>
  );
};

export default GradientText;
