import React from 'react';

export enum ActivityType {
  SOCIAL = 'SOCIAL',
  ACADEMIC = 'ACADEMIC',
  VOLUNTEER = 'VOLUNTEER',
  SPORT = 'SPORT',
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  views: number;
  imageUrl?: string;
  authorId: string;
  category?: string;
  excerpt?: string;
}

export interface SiteSettings {
  bannerUrl: string;
  topBannerUrl?: string;
  banners?: string[];
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface User {
  uid: string;
  email: string;
  fullName: string;
  mssv: string;
  department: string;
  classCode: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  phoneNumber?: string;
}

export interface CriterionItem {
  id: string;
  label: string;
  description: string;
  evidence?: string;
  feedback?: string;
  isMet: boolean;
  status?: 'APPROVED' | 'MISSING' | 'PENDING';
  subItems?: CriterionItem[];
}

export interface SV5TCriteria {
  id: string;
  userId: string;
  userName: string;
  userMssv: string;
  criteria: CriterionItem[];
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUPPLEMENT_REQUIRED';
  adminFeedback?: string;
}

export interface CriterionConfig {
  id: string;
  label: string;
  description: string;
  subItems?: CriterionConfig[];
}

export interface VolunteerCertificate {
  id: string;
  mssv: string;
  studentName: string;
  eventName: string;
  date: string;
  hours: number;
  issueDate: string;
}
