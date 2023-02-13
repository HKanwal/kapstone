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
    path: '/shop-results',
    icon: <IoIcons.IoMdMap />,
  },
  {
    title: 'Appointments',
    path: '#',
    icon: <IoIcons.IoMdCalendar />,
  },
  {
    title: 'Quote Requests',
    path: '/quote-request',
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
    path: '/work-orders',
    icon: <IoIcons.IoMdCalculator />,
  },
  {
    title: 'Quotes',
    path: '/quote-request',
    icon: <IoIcons.IoMdFiling />,
  },
];

export const EmployeeNavbarData = ShopOwnerNavbarData.filter(
  (item) => !['Employees'].includes(item.title)
);
