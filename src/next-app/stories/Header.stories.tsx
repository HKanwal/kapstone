import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Header from '../components/Header';
import { BsFilter } from 'react-icons/bs';

export default {
  title: 'Example/Header',
  component: Header,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const WithTitle = Template.bind({});
WithTitle.args = {
  title: 'Test Page',
};

export const WithoutTitle = Template.bind({});
WithoutTitle.args = {};

export const RightIcon = Template.bind({});
RightIcon.args = {
  title: 'Test Page',
  rightIcon: BsFilter,
};

export const BurgerMenu = Template.bind({});
BurgerMenu.args = {
  title: 'Test Page',
  burgerMenu: [
    {
      option: 'Option A',
      onClick() {
        alert('Option A clicked');
      },
    },
    {
      option: 'Option B',
    },
  ],
};
