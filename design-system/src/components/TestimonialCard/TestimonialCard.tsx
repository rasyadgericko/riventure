import React from 'react';
import './TestimonialCard.css';

export interface TestimonialCardProps {
  text: string;
  name: string;
  role: string;
  initials: string;
  variant?: 'featured' | 'sub';
}

const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Stars = () => (
  <div className="ryc-testimonial__stars" role="img" aria-label="5 out of 5 stars">
    <Star /><Star /><Star /><Star /><Star />
  </div>
);

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  text,
  name,
  role,
  initials,
  variant = 'sub',
}) => (
  <div className={`ryc-testimonial--${variant}`}>
    {variant === 'featured' ? (
      <>
        <p className="ryc-testimonial__text">{`"${text}"`}</p>
        <div className="ryc-testimonial__author">
          <div className="ryc-testimonial__avatar">{initials}</div>
          <div>
            <div className="ryc-testimonial__name">{name}</div>
            <div className="ryc-testimonial__role">{role}</div>
          </div>
          <Stars />
        </div>
      </>
    ) : (
      <>
        <div className="ryc-testimonial__top">
          <Stars />
          <span className="ryc-testimonial__quote">"</span>
        </div>
        <p className="ryc-testimonial__text">{text}</p>
        <div className="ryc-testimonial__author">
          <div className="ryc-testimonial__avatar">{initials}</div>
          <div>
            <div className="ryc-testimonial__name">{name}</div>
            <div className="ryc-testimonial__role">{role}</div>
          </div>
        </div>
      </>
    )}
  </div>
);
