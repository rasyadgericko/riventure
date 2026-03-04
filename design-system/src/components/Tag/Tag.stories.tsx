import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'featured', 'ai', 'pill'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { children: 'Core', variant: 'default' },
};

export const Featured: Story = {
  args: { children: 'Most Popular', variant: 'featured' },
};

export const AI: Story = {
  args: { children: 'AI pre-analyses your site & competitors', variant: 'ai' },
};

export const Pill: Story = {
  args: { children: '3 Weeks Average', variant: 'pill' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag>Core</Tag>
      <Tag variant="featured">Most Popular</Tag>
      <Tag variant="ai">Claude generates code</Tag>
      <Tag variant="pill">90+ Lighthouse</Tag>
    </div>
  ),
};
