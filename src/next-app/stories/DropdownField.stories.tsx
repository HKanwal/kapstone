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
  name: '',
  placeholder: 'Search for an item...',
  items: ['Cat', 'Dog', 'Frog'],
};

export const Named = Template.bind({});
Named.args = {
  name: 'Animal',
  placeholder: 'Search for an item...',
  items: ['Cat', 'Dog', 'Frog'],
};

export const Required = Template.bind({});
Required.args = {
  name: 'Animal',
  placeholder: 'Search for an item...',
  items: ['Cat', 'Dog', 'Frog'],
  required: true,
};

export const Multi = Template.bind({});
Multi.args = {
  name: 'Animals',
  placeholder: 'Search for an item...',
  items: ['Cat', 'Dog', 'Frog', 'Pig', 'Cow', 'Goose'],
  type: 'multi-select',
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: 'Animals',
  placeholder: 'Search for an item...',
  items: ['Cat', 'Dog', 'Frog'],
  disabled: true,
};

export const DisabledMulti = Template.bind({});
DisabledMulti.args = {
  name: 'Animals',
  placeholder: 'Search for an item...',
  items: ['Cat', 'Dog', 'Frog'],
  type: 'multi-select',
  disabled: true,
};
