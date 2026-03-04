import React from 'react';
import './PricingCard.css';
import { Tag } from '../Tag/Tag';
import { Button } from '../Button/Button';

export interface PricingCardProps {
  tag: string;
  delivery: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
  ctaLabel?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  tag,
  delivery,
  price,
  description,
  features = [],
  featured = false,
  ctaLabel = 'Start a Project',
}) => (
  <div className={`ryc-pricing-card${featured ? ' ryc-pricing-card--featured' : ''}`}>
    <div className="ryc-pricing-card__top">
      <Tag variant={featured ? 'featured' : 'default'}>{tag}</Tag>
      <span className="ryc-pricing-card__delivery">{delivery}</span>
    </div>
    <div className="ryc-pricing-card__from">from</div>
    <div className="ryc-pricing-card__price">{price}</div>
    <p className="ryc-pricing-card__desc">{description}</p>
    <ul className="ryc-pricing-card__list">
      {features.map((f, i) => <li key={i}>{f}</li>)}
    </ul>
    <Button variant={featured ? 'primary' : 'outline'}>{ctaLabel}</Button>
  </div>
);
