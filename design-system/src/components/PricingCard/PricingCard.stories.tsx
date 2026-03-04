import type { Meta, StoryObj } from '@storybook/react';
import { PricingCard } from './PricingCard';

const meta: Meta<typeof PricingCard> = {
  title: 'Components/PricingCard',
  component: PricingCard,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 380 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof PricingCard>;

export const Launch: Story = {
  args: {
    tag: 'Launch',
    delivery: '5-7 days',
    price: '$2,500',
    description: 'For landing pages, personal brands, and solo founders who need a polished digital presence — fast.',
    features: ['Single-page or 3-5 page site', 'Custom design, no templates', 'Mobile-first, 90+ Lighthouse', '30-day post-launch support'],
  },
};

export const Studio: Story = {
  args: {
    tag: 'Most Popular',
    delivery: '2-3 weeks',
    price: '$6,000',
    description: 'Full marketing sites and brand builds for startups, SMBs, and e-commerce brands ready to compete.',
    features: ['5-12 pages, full design system', 'UI/UX design + brand identity', 'CMS integration if needed', 'SEO-optimised from day one', '30-day post-launch support'],
    featured: true,
  },
};

export const Platform: Story = {
  args: {
    tag: 'Platform',
    delivery: '3-5 weeks',
    price: '$14,000',
    description: 'SaaS dashboards, e-commerce platforms, and complex custom builds for businesses ready to scale.',
    features: ['SaaS, e-commerce, or custom build', 'Full-stack architecture', 'API & third-party integrations', 'Performance & security hardened', '30-day post-launch support'],
  },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 1100 }}>
      <PricingCard tag="Launch" delivery="5-7 days" price="$2,500" description="Landing pages and solo founders." features={['3-5 pages', 'Custom design', '90+ Lighthouse', '30-day support']} />
      <PricingCard tag="Most Popular" delivery="2-3 weeks" price="$6,000" description="Full marketing sites." features={['5-12 pages', 'UI/UX + brand', 'CMS integration', 'SEO built-in', '30-day support']} featured />
      <PricingCard tag="Platform" delivery="3-5 weeks" price="$14,000" description="SaaS and e-commerce." features={['Full-stack', 'API integrations', 'Security hardened', '30-day support']} />
    </div>
  ),
};
