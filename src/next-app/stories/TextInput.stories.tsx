import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TextInput from '../components/TextInput';

export default {
  title: 'Example/TextInput',
  component: TextInput,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'padded',
  },
  args: {
    onRemove: undefined,
  },
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter some text',
};

export const Removable = Template.bind({});
Removable.args = {
  placeholder: 'I have an X',
  onRemove: () => {},
};

export const Error = Template.bind({});
Error.args = {
  placeholder: 'I have an error :(',
  error: true,
};

export const WithDropdown = Template.bind({});
WithDropdown.args = {
  placeholder: 'I have a dropdown!',
  rightItems: ['km', 'miles'],
};
