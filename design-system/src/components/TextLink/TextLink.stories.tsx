import type { Meta, StoryObj } from '@storybook/react';
import { TextLink } from './TextLink';

const meta: Meta<typeof TextLink> = {
  title: 'Components/TextLink',
  component: TextLink,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextLink>;

export const Default: Story = {
  args: {
    children: 'View our work',
    href: '#work',
  },
};

export const InContext: Story = {
  render: () => (
    <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.8 }}>
      Most agencies take months and charge like it. We ship in weeks.{' '}
      <TextLink href="#work">See our portfolio</TextLink>
    </p>
  ),
};
