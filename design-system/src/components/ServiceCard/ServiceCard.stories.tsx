import type { Meta, StoryObj } from '@storybook/react';
import { ServiceCard } from './ServiceCard';

const meta: Meta<typeof ServiceCard> = {
  title: 'Components/ServiceCard',
  component: ServiceCard,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof ServiceCard>;

export const Default: Story = {
  args: {
    tag: 'Core',
    number: '01',
    name: 'Web Development',
    description: 'Production-grade websites built with Claude AI and reviewed by humans. Ship in weeks with 90+ Lighthouse scores out of the box.',
  },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 1000 }}>
      <ServiceCard tag="Core" number="01" name="Web Development" description="Production-grade websites built with Claude AI and reviewed by humans." />
      <ServiceCard tag="Design" number="02" name="UI/UX Design" description="Interfaces that make investors say yes and users come back." />
      <ServiceCard tag="Branding" number="03" name="Brand Identity" description="From name to full visual system — a brand that looks established from day one." />
    </div>
  ),
};
