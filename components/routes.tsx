// Job Tracking System Routes
import { IRoute } from '@/types/types';
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineChartBarSquare,
  HiOutlineCog8Tooth,
  HiOutlineBuildingOffice2
} from 'react-icons/hi2';

export const routes: IRoute[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <HiOutlineHome className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />,
    collapse: false
  },
  {
    name: 'Jobs',
    path: '/dashboard/jobs',
    icon: (
      <HiOutlineBriefcase className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false
  },
  {
    name: 'Calendar',
    path: '/dashboard/calendar',
    icon: (
      <HiOutlineCalendarDays className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false
  },
  {
    name: 'Contacts',
    path: '/dashboard/contacts',
    icon: (
      <HiOutlineUsers className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false
  },
  {
    name: 'Companies',
    path: '/dashboard/companies',
    icon: (
      <HiOutlineBuildingOffice2 className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false
  },
  {
    name: 'Reports',
    path: '/dashboard/reports',
    icon: (
      <HiOutlineChartBarSquare className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false
  },
  {
    name: 'Settings',
    path: '/dashboard/settings',
    icon: (
      <HiOutlineCog8Tooth className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false
  }
];
