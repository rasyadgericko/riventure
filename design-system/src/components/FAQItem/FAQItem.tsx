import React, { useState } from 'react';
import './FAQItem.css';

export interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`ryc-faq-item${open ? ' ryc-faq-item--open' : ''}`}>
      <button
        className="ryc-faq-q"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className="ryc-faq-icon" aria-hidden="true" />
      </button>
      <div className="ryc-faq-a">
        <div className="ryc-faq-a-inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};
