import React from 'react';
import './Tag.css';

export interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'featured' | 'ai' | 'pill';
}

export const Tag: React.FC<TagProps> = ({ children, variant = 'default' }) => {
  const className = ['ryc-tag', variant !== 'default' && `ryc-tag--${variant}`].filter(Boolean).join(' ');
  return <span className={className}>{children}</span>;
};
