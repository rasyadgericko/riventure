import type { Meta, StoryObj } from '@storybook/react';
import { FAQItem } from './FAQItem';

const meta: Meta<typeof FAQItem> = {
  title: 'Components/FAQItem',
  component: FAQItem,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 700 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof FAQItem>;

export const Closed: Story = {
  args: {
    question: 'How long does a typical project take?',
    answer: 'Most projects ship in 1-3 weeks from kickoff. A focused marketing site or landing page is typically 1-2 weeks. A full SaaS dashboard or e-commerce build runs 3-4 weeks.',
  },
};

export const Open: Story = {
  args: {
    question: 'What does AI-native actually mean for my project?',
    answer: 'It means AI (primarily Claude) handles code generation, competitive research, and QA iterations — cutting the time on repeatable tasks by 3×. Every output still gets a human review before anything touches your project.',
    defaultOpen: true,
  },
};

export const List: Story = {
  render: () => (
    <div>
      <FAQItem question="How long does a typical project take?" answer="Most projects ship in 1-3 weeks from kickoff." />
      <FAQItem question="What does AI-native actually mean?" answer="AI handles code generation and QA. Humans review everything." />
      <FAQItem question="Do you only build websites?" answer="Both. Marketing sites, SaaS platforms, e-commerce, and internal tools." />
      <FAQItem question="What happens after launch?" answer="30 days of bug fixes included. Most clients move to a monthly retainer." />
      <FAQItem question="How much does a project cost?" answer="From $2,500 (Launch) to $14,000+ (Platform). Clear, itemised quotes within 24 hours." />
    </div>
  ),
};
