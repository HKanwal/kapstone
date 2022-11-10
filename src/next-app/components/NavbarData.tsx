import React from 'react';
import * as IoIcons from 'react-icons/io';

export const NavbarData = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: <IoIcons.IoMdHome />,
    cName: 'nav-text',
  },
  {
    title: 'Services',
    path: '/create-account',
    icon: <IoIcons.IoMdConstruct />,
    cName: 'nav-text',
  },
  {
    title: 'Appointments',
    path: '/create-shop',
    icon: <IoIcons.IoMdCalendar />,
    cName: 'nav-text',
  },
  {
    title: 'Employees',
    path: '/invite',
    icon: <IoIcons.IoMdPeople />,
    cName: 'nav-text',
  },
  {
    title: 'Work Orders',
    path: '/login',
    icon: <IoIcons.IoMdCalculator />,
    cName: 'nav-text',
  },
  {
    title: 'Quotes',
    path: '/',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text',
  },
];
