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
    path: '/create-account',
    icon: <IoIcons.IoMdConstruct />,
  },
  {
    title: 'Appointments',
    path: '/create-shop',
    icon: <IoIcons.IoMdCalendar />,
  },
  {
    title: 'Employees',
    path: '/invite',
    icon: <IoIcons.IoMdPeople />,
  },
  {
    title: 'Work Orders',
    path: '/login',
    icon: <IoIcons.IoMdCalculator />,
  },
  {
    title: 'Quotes',
    path: '/',
    icon: <IoIcons.IoMdFiling />,
  },
];
