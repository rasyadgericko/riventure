import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const ProjectType: Story = {
  args: {
    label: 'Project Type',
    name: 'project_type',
    placeholder: 'Select a type',
    required: true,
    options: [
      { value: 'website', label: 'Website / Landing Page' },
      { value: 'saas', label: 'SaaS / Web App' },
      { value: 'ecommerce', label: 'E-Commerce' },
      { value: 'branding', label: 'Branding & Identity' },
      { value: 'other', label: 'Other' },
    ],
  },
};

export const Timeline: Story = {
  args: {
    label: 'Timeline',
    name: 'timeline',
    placeholder: 'When do you need it?',
    required: true,
    options: [
      { value: 'asap', label: 'ASAP' },
      { value: '1month', label: 'Within 1 month' },
      { value: '3months', label: '1-3 months' },
      { value: 'flexible', label: 'Flexible' },
    ],
  },
};
