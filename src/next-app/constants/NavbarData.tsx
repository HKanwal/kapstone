import React from 'react';
import * as IoIcons from 'react-icons/io';

export const CustomerNavbarData = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: <IoIcons.IoMdHome />,
  },
  {
    title: 'Shop Search',
    path: '/find-shop',
    icon: <IoIcons.IoMdMap />,
  },
  {
    title: 'Appointments',
    path: '/booked-appointments',
    icon: <IoIcons.IoMdCalendar />,
  },
  {
    title: 'Quote Requests',
    path: '/quote-request-list',
    icon: <IoIcons.IoMdFiling />,
  },
];

export const ShopOwnerNavbarData = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: <IoIcons.IoMdHome />,
  },
  {
    title: 'Services',
    path: '/services',
    icon: <IoIcons.IoMdConstruct />,
  },
  {
    title: 'Appointments',
    path: '/appointment-schedule',
    icon: <IoIcons.IoMdCalendar />,
  },
  {
    title: 'Employees',
    path: '/employees',
    icon: <IoIcons.IoMdPeople />,
  },
  {
    title: 'Invitations',
    path: '/invitations',
    icon: <IoIcons.IoMdMan />,
  },
  {
    title: 'Work Orders',
    path: '/work-orders',
    icon: <IoIcons.IoMdCalculator />,
  },
  {
    title: 'Quotes',
    path: '/quote-list',
    icon: <IoIcons.IoMdFiling />,
  },
];

export const EmployeeNavbarData = ShopOwnerNavbarData.filter(
  (item) => !['Employees', 'Invitations'].includes(item.title)
);
