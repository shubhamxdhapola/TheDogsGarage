import React from 'react';

export const StarBorder = ({
  as: Component = 'div',
  className = '',
  color = '#E86A2C',
  speed = '6s',
  children,
  ...props
}) => {
  return (
    <Component className={`relative inline-block overflow-hidden rounded-2xl p-[1px] ${className}`} {...props}>
      <div
        className="absolute inset-[-100%] animate-[spin_6s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0%, ${color} 50%, transparent 100%)`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-10 w-full h-full rounded-[calc(1rem-1px)] bg-white">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
