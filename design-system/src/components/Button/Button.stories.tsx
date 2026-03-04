import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'submit'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    showArrow: {
      control: 'boolean',
      description: 'Show arrow icon',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state (submit variant only)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Start a Project',
    variant: 'primary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Start a Project',
    variant: 'outline',
  },
};

export const Submit: Story = {
  args: {
    children: 'Send Message',
    variant: 'submit',
    showArrow: false,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Sending...',
    variant: 'submit',
    disabled: true,
    showArrow: false,
  },
};

export const Small: Story = {
  args: {
    children: 'Learn More',
    variant: 'primary',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: "Let's Talk",
    variant: 'primary',
    size: 'lg',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="submit" showArrow={false}>Submit</Button>
      <Button variant="submit" disabled showArrow={false}>Disabled</Button>
    </div>
  ),
};
