import React from 'react';
import * as IoIcons from 'react-icons/io';

export const NavbarData = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: <IoIcons.IoMdHome />,
  },
  {
    title: 'Services',
    path: '#',
    icon: <IoIcons.IoMdConstruct />,
  },
  {
    title: 'Appointments',
    path: '#',
    icon: <IoIcons.IoMdCalendar />,
  },
  {
    title: 'Employees',
    path: '/employees',
    icon: <IoIcons.IoMdPeople />,
  },
  {
    title: 'Work Orders',
    path: '#',
    icon: <IoIcons.IoMdCalculator />,
  },
  {
    title: 'Quotes',
    path: '/quote-request',
    icon: <IoIcons.IoMdFiling />,
  },
];
