import { FaChartLine, FaBox, FaUsers, FaEnvelope, FaCog } from 'react-icons/fa';

export const sidebarData = [
  {
    id: 1,
    title: 'Dashboard',
    titleKey: 'nav.dashboard',
    icon: FaChartLine,
    path: '/dashboard'
  },
  {
    id: 2,
    title: 'Products',
    titleKey: 'nav.products',
    icon: FaBox,
    path: '/products'
  },
  {
    id: 3,
    title: 'Users',
    titleKey: 'nav.users',
    icon: FaUsers,
    path: '/users'
  },
  {
    id: 4,
    title: 'Messages',
    titleKey: 'nav.messages',
    icon: FaEnvelope,
    path: '/messages'
  },
  {
    id: 5,
    title: 'Settings',
    titleKey: 'nav.settings',
    icon: FaCog,
    path: '/settings'
  }
];
