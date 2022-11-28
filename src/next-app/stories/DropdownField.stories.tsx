import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DropdownField from '../components/DropdownField';

export default {
  title: 'Example/DropdownField',
  component: DropdownField,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded',
  },
} as ComponentMeta<typeof DropdownField>;

const Template: ComponentStory<typeof DropdownField> = (args) => <DropdownField {...args} />;

export const Nameless = Template.bind({});
Nameless.args = {
  placeholder: 'Search for an item...',
  items: new Set(['Cat', 'Dog', 'Frog']),
};

export const Named = Template.bind({});
Named.args = {
  name: 'Animal',
  placeholder: 'Search for an item...',
  items: new Set(['Cat', 'Dog', 'Frog']),
};

export const Required = Template.bind({});
Required.args = {
  name: 'Animal',
  placeholder: 'Search for an item...',
  items: new Set(['Cat', 'Dog', 'Frog']),
  required: true,
};
