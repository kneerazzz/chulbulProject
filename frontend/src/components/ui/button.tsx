// src/components/ui/Button.tsx
'use client'
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({ children, onClick, variant = 'primary', type = 'button' }: ButtonProps) => {
  const baseStyle = 'px-4 py-2 rounded-xl font-semibold transition-colors duration-200';
  const variantStyle =
    variant === 'primary'
      ? 'bg-black text-white hover:bg-gray-800'
      : 'bg-white text-black border hover:bg-gray-100';

  return (
    <button onClick={onClick} type={type} className={`${baseStyle} ${variantStyle}`}>
      {children}
    </button>
  );
};

export default Button;
