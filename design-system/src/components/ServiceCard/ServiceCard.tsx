import React from 'react';
import './ServiceCard.css';
import { Tag } from '../Tag/Tag';

export interface ServiceCardProps {
  tag: string;
  number: string;
  name: string;
  description: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ tag, number, name, description }) => (
  <div className="ryc-service-card" tabIndex={0}>
    <div className="ryc-service-card__top">
      <Tag>{tag}</Tag>
      <span className="ryc-service-card__num">{number}</span>
    </div>
    <div className="ryc-service-card__name">{name}</div>
    <p className="ryc-service-card__desc">{description}</p>
  </div>
);
