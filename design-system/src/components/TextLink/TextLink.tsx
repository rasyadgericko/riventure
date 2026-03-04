import React from 'react';
import './TextLink.css';

export interface TextLinkProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export const TextLink: React.FC<TextLinkProps> = ({ children, href = '#', onClick }) => (
  <a className="ryc-text-link" href={href} onClick={onClick}>
    {children}
  </a>
);
