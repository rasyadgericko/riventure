import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Name',
    name: 'name',
    placeholder: 'Your name',
    required: true,
  },
};

export const Email: Story = {
  args: {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'your@email.com',
    required: true,
  },
};

export const Optional: Story = {
  args: {
    label: 'Phone',
    name: 'phone',
    type: 'tel',
    placeholder: '+1 (555) 000-0000',
    optional: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'your@email.com',
    error: 'Please enter a valid email address',
    value: 'not-an-email',
  },
};
