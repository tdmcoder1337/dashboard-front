import { FaChartLine, FaBox, FaUsers, FaEnvelope, FaCog } from 'react-icons/fa';

export const sidebarData = [
  {
    id: 1,
    title: 'Dashboard',
    icon: FaChartLine,
    path: '/dashboard'
  },
  {
    id: 2,
    title: 'Products',
    icon: FaBox,
    path: '/products'
  },
  {
    id: 3,
    title: 'Users',
    icon: FaUsers,
    path: '/users'
  },
  {
    id: 4,
    title: 'Messages',
    icon: FaEnvelope,
    path: '/messages'
  },
  {
    id: 5,
    title: 'Settings',
    icon: FaCog,
    path: '/settings'
  }
];
