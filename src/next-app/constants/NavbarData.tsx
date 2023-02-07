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
    path: '/create-service',
    icon: <IoIcons.IoMdConstruct />,
  },
  {
    title: 'Appointments',
    path: '#',
    icon: <IoIcons.IoMdCalendar />,
  },
  {
    title: 'Employees',
    path: '/invite',
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
