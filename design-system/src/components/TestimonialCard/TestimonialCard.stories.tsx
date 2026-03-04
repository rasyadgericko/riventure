import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialCard } from './TestimonialCard';

const meta: Meta<typeof TestimonialCard> = {
  title: 'Components/TestimonialCard',
  component: TestimonialCard,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 600 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof TestimonialCard>;

export const Featured: Story = {
  args: {
    variant: 'featured',
    text: "I'd worked with two agencies before who took months and delivered templates. RYC rebuilt our entire storefront in three weeks — and our conversion rate jumped 40% the first month.",
    name: 'Sarah Laurent',
    role: 'Founder, Maison Luxe',
    initials: 'SL',
  },
};

export const Supporting: Story = {
  args: {
    variant: 'sub',
    text: "We gave them four weeks and honestly expected to push the deadline. They delivered in three. The dashboard handles 50K concurrent users and we haven't touched the codebase since.",
    name: 'James Kim',
    role: 'CTO, Nexus Analytics',
    initials: 'JK',
  },
};

export const Layout: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      <TestimonialCard variant="featured" text="RYC rebuilt our entire storefront in three weeks — conversion rate jumped 40%." name="Sarah Laurent" role="Founder, Maison Luxe" initials="SL" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <TestimonialCard text="They delivered in three weeks. The dashboard handles 50K concurrent users." name="James Kim" role="CTO, Nexus Analytics" initials="JK" />
        <TestimonialCard text="HIPAA compliance baked into architecture from the first commit. Zero audit findings." name="Dr. Rachel Torres" role="CEO, MedSync Pro" initials="RT" />
      </div>
    </div>
  ),
};
