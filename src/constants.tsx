import { BookOpen, Users, Flag, Calendar, Heart, Award } from 'lucide-react';
import React from 'react';
import { NewsItem, Club } from './types';

export const NAV_LINKS = [
  { name: 'Trang chủ', href: '#home' },
  { name: 'Giới thiệu', href: '#about' },
  { name: 'Hoạt động', href: '#activities' },
  { name: 'Tin tức', href: '#news' },
  { name: 'Câu lạc bộ', href: '#clubs' },
  { name: 'Tham quan', href: '#visit-registration' },
  { name: 'Liên hệ', href: '#contact' },
];

export const STATS = [
  { label: 'Sinh viên', value: '10,000+', icon: Users },
  { label: 'CLB & Đội nhóm', value: '25+', icon: Flag },
  { label: 'Sự kiện hàng năm', value: '50+', icon: Calendar },
  { label: 'Năm truyền thống', value: '110+', icon: Award },
];

export const NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Phát động chiến dịch Mùa Hè Xanh 2026',
    excerpt: 'Hội sinh viên trường ra quân chiến dịch tình nguyện lớn nhất trong năm tại các địa phương khó khăn.',
    date: '15/04/2026',
    category: 'Tình nguyện',
    image: 'https://picsum.photos/seed/volunteer/800/600',
  },
  {
    id: '2',
    title: 'Hội thảo Kỹ năng thực hành xã hội',
    excerpt: 'Trang bị cho sinh viên những kỹ năng thiết yếu để tự tin bước vào môi trường làm việc chuyên nghiệp.',
    date: '10/04/2026',
    category: 'Kỹ năng',
    image: 'https://picsum.photos/seed/skills/800/600',
  },
  {
    id: '3',
    title: 'Giải bóng đá sinh viên Cao Thắng 2026',
    excerpt: 'Khai mạc giải bóng đá truyền thống với sự tham gia của hơn 30 đội bóng đến từ các khoa.',
    date: '05/04/2026',
    category: 'Thể thao',
    image: 'https://picsum.photos/seed/sports/800/600',
  },
];
