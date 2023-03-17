import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BookedAppointment from '../components/BookedAppointment';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/BookedAppointment',
  component: BookedAppointment,
  parameters: {
    layout: 'padded',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof BookedAppointment>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BookedAppointment> = (args) => (
  <BookedAppointment {...args} />
);

export const Default = Template.bind({});
Default.args = {
  shopName: 'My Shop',
  date: 'Friday Jan 5, 2023',
  startTime: '5:30',
  endTime: '6:00',
};
