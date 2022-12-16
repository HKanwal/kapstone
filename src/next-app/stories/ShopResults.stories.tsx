import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ShopResult from '../components/ShopResult';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/ShopResult',
  component: ShopResult,
  parameters: {
    layout: 'padded',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ShopResult>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ShopResult> = (args) => <ShopResult {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Example Shop',
  distance: '15 km',
};

export const Canned = Template.bind({});
Canned.args = {
  name: 'Example Shop',
  distance: '15km',
  cannedDetails: {
    cost: 500,
    time: '1 hour',
  },
};

export const SelectMode = Template.bind({});
SelectMode.args = {
  name: 'Example Shop',
  distance: '15 km',
  inSelectMode: true,
};
