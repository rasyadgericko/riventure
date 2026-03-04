import React from 'react';
import './Button.css';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'submit';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  showArrow?: boolean;
}

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  href,
  showArrow = true,
}) => {
  const className = [
    'ryc-btn',
    `ryc-btn--${variant}`,
    size !== 'md' && `ryc-btn--${size}`,
  ].filter(Boolean).join(' ');

  if (href) {
    return (
      <a href={href} className={className}>
        <span>{children}</span>
        {showArrow && <Arrow />}
      </a>
    );
  }

  return (
    <button className={className} onClick={onClick} disabled={disabled} type={variant === 'submit' ? 'submit' : 'button'}>
      <span>{children}</span>
      {showArrow && <Arrow />}
    </button>
  );
};
