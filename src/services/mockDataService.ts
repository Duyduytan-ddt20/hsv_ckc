import { User, SV5TCriteria, VolunteerCertificate, CriterionConfig, CriterionItem, Article, SiteSettings } from '../types';

const USERS_KEY = 'ct_hsv_users';
const CURRENT_USER_KEY = 'ct_hsv_current_user';
const SV5T_KEY = 'ct_hsv_sv5t';
const CONFIG_KEY = 'ct_hsv_config';

const MOCK_CERTIFICATES: VolunteerCertificate[] = [
  {
    id: 'CERT-001',
    mssv: '22000001',
    studentName: 'Nguyễn Văn A',
    eventName: 'Mùa Hè Xanh 2025',
    date: 'Tháng 7/2025',
    hours: 120,
    issueDate: '01/09/2025'
  },
  {
    id: 'CERT-002',
    mssv: '22000001',
    studentName: 'Nguyễn Văn A',
    eventName: 'Hiến máu nhân đạo 2025',
    date: '15/10/2025',
    hours: 8,
    issueDate: '20/10/2025'
  },
  {
    id: 'CERT-003',
    mssv: '22000002',
    studentName: 'Trần Thị B',
    eventName: 'Tiếp sức mùa thi 2025',
    date: 'Tháng 6/2025',
    hours: 45,
    issueDate: '10/07/2025'
  }
];

const DEFAULT_CRITERIA: CriterionConfig[] = [
  { 
    id: 'ethics', 
    label: 'Đạo đức tốt', 
    description: 'Rèn luyện đạo đức, tác phong',
    subItems: [
      { id: 'ethics_1', label: 'Kết quả rèn luyện', description: 'Đạt loại Xuất sắc (90 điểm trở lên)' },
      { id: 'ethics_2', label: 'Ý thức pháp luật', description: 'Không vi phạm pháp luật và nội quy nhà trường' },
    ]
  },
  { 
    id: 'academic', 
    label: 'Học tập tốt', 
    description: 'Kết quả học tập và nghiên cứu',
    subItems: [
      { id: 'academic_1', label: 'Điểm trung bình', description: 'Đạt từ 3.2/4.0 hoặc 8.0/10 trở lên' },
      { id: 'academic_2', label: 'Nghiên cứu khoa học', description: 'Tham gia đề tài NCKH hoặc các cuộc thi học thuật' },
    ]
  },
  { 
    id: 'physical', 
    label: 'Thể lực tốt', 
    description: 'Rèn luyện sức khỏe',
    subItems: [
      { id: 'physical_1', label: 'Chứng nhận thể lực', description: 'Đạt danh hiệu Thanh niên khỏe hoặc tương đương' },
    ]
  },
  { 
    id: 'skills', 
    label: 'Kỹ năng tốt', 
    description: 'Kỹ năng thực hành xã hội',
    subItems: [
      { id: 'skills_1', label: 'Kỹ năng mềm', description: 'Hoàn thành các khóa học kỹ năng mềm' },
      { id: 'skills_2', label: 'Hoạt động Đoàn - Hội', description: 'Tích cực tham gia các hoạt động cấp khoa/trường' },
    ]
  },
  { 
    id: 'integration', 
    label: 'Hội nhập tốt', 
    description: 'Ngoại ngữ, tin học và giao lưu',
    subItems: [
      { id: 'integration_1', label: 'Ngoại ngữ', description: 'Đạt chứng chỉ Tiếng Anh (TOEIC 500+ hoặc tương đương)' },
      { id: 'integration_2', label: 'Tin học', description: 'Sử dụng thành thạo máy tính (MOS, IC3...)' },
    ]
  },
];

const ARTICLES_KEY = 'ct_hsv_articles';
const SETTINGS_KEY = 'ct_hsv_settings';

const DEFAULT_SETTINGS: SiteSettings = {
  bannerUrl: 'https://picsum.photos/seed/caothang/1920/1080?blur=2',
  topBannerUrl: 'https://i.ibb.co/Xxd9T6F/top-banner-demo.jpg',
  banners: [
    'https://picsum.photos/seed/caothang1/1920/1080?blur=2',
    'https://picsum.photos/seed/caothang2/1920/1080?blur=2',
    'https://picsum.photos/seed/caothang3/1920/1080?blur=2'
  ],
  logoUrl: '',
  heroTitle: 'Hội Sinh Viên Cao Thắng',
  heroSubtitle: 'Đoàn kết - Sáng tạo - Xung kích - Hội nhập'
};

const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Kế hoạch tổ chức Hội thi "Thủ lĩnh sinh viên Thành phố Hồ Chí Minh" lần thứ 8 – năm 2026',
    content: `Hội thi "Thủ lĩnh sinh viên Thành phố Hồ Chí Minh" là sân chơi bổ ích dành cho cán bộ Hội, hội viên, sinh viên tiêu biểu có năng lực dẫn dắt và tổ chức các hoạt động phong trào. Năm 2026, với chủ đề "Khát vọng - Bản lĩnh - Sáng tạo", hội thi hứa hẹn sẽ mang đến nhiều nội dung hấp dẫn, bám sát thực tiễn công tác Hội và phong trào sinh viên trong giai đoạn mới.\n\nCác nội dung thi bao gồm kiến thức về lịch sử, văn hóa, xã hội, kỹ năng làm việc nhóm, xử lý tình huống và xây dựng dự án cộng đồng.`,
    date: '03/05/2026',
    views: 1250,
    authorId: 'admin',
    category: 'Thông báo',
    imageUrl: 'https://picsum.photos/seed/article1/800/400',
    excerpt: 'Hội thi "Thủ lĩnh sinh viên Thành phố Hồ Chí Minh" là sân chơi bổ ích dành cho cán bộ Hội, hội viên, sinh viên tiêu biểu...'
  },
  {
    id: '2',
    title: 'SV5T TIN CƠ SỞ – LỄ TUYÊN DƯƠNG "SINH VIÊN 5 TỐT" TRƯỜNG ĐẠI HỌC...',
    content: 'Buổi lễ diễn ra trang trọng với sự tham dự của đại diện Đảng ủy, Ban Giám hiệu nhà trường cùng đông đảo các bạn sinh viên đạt danh hiệu.',
    date: '02/05/2026',
    views: 840,
    authorId: 'admin',
    category: 'Sinh viên 5 Tốt'
  },
  {
    id: '3',
    title: 'ĐOÀN VIÊN, SINH VIÊN TRƯỜNG ĐẠI HỌC VĂN LANG TỔ CHỨC NGÀY CHỦ...',
    content: 'Hoạt động ý nghĩa này đã thu hút hàng hàng ngàn lượt sinh viên tham gia dọn dẹp vệ sinh môi trường, trồng thêm cây xanh...',
    date: '01/05/2026',
    views: 560,
    authorId: 'admin',
    category: 'Tình nguyện'
  }
];

export const mockAdminService = {
  getArticles: (): Article[] => {
    const data = localStorage.getItem(ARTICLES_KEY);
    return data ? JSON.parse(data) : INITIAL_ARTICLES;
  },
  saveArticle: (article: Article) => {
    const articles = mockAdminService.getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index !== -1) {
      articles[index] = article;
    } else {
      articles.push(article);
    }
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  },
  deleteArticle: (id: string) => {
    const articles = mockAdminService.getArticles();
    const filtered = articles.filter(a => a.id !== id);
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(filtered));
  },
  getSettings: (): SiteSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    const settings = data ? JSON.parse(data) : DEFAULT_SETTINGS;
    // Migration: ensure new fields exist
    if (!settings.banners) settings.banners = DEFAULT_SETTINGS.banners;
    if (settings.topBannerUrl === undefined) settings.topBannerUrl = DEFAULT_SETTINGS.topBannerUrl;
    return settings;
  },
  updateSettings: (settings: SiteSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
  createCollaborator: (user: Omit<User, 'uid' | 'role'>): User => {
    const users = mockAuthService.getUsers();
    const newUser: User = { 
      ...user, 
      uid: 'ctv-' + Math.random().toString(36).substr(2, 9), 
      role: 'USER' // Collaborative user might still have USER role but specialized permissions in a real app, or we could add a CTV role
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  }
};

export const mockAuthService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      const initialUsers: User[] = [
        {
          uid: 'admin-fixed',
          email: 'admin@caothang.edu.vn',
          fullName: 'Quản trị viên (Hệ thống)',
          mssv: 'ADMIN-001',
          department: 'Hội Sinh Viên',
          classCode: 'HSV',
          role: 'ADMIN'
        },
        {
          uid: 'user-1',
          email: 'sv1@caothang.edu.vn',
          fullName: 'Nguyễn Văn Anh',
          mssv: '22000001',
          department: 'Công nghệ Thông tin',
          classCode: 'CCQ2210A',
          role: 'USER',
          phoneNumber: '0987654321'
        },
        {
          uid: 'user-2',
          email: 'sv2@caothang.edu.vn',
          fullName: 'Trần Thị Bình',
          mssv: '22000002',
          department: 'Kinh tế',
          classCode: 'CKT2205',
          role: 'USER',
          phoneNumber: '0123456789'
        }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(data);
  },

  register: (user: Omit<User, 'uid' | 'role'>): User => {
    const users = mockAuthService.getUsers();
    // First user or @admin email becomes admin for demo
    const role = (users.length === 0 || user.email.endsWith('@admin.com')) ? 'ADMIN' : 'USER';
    const newUser: User = { ...user, uid: Math.random().toString(36).substr(2, 9), role };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  login: (email: string, mssv: string): User | null => {
    // Special dev login
    if (email === 'admin' && mssv === '123') {
      const adminUser: User = {
        uid: 'admin-fixed',
        email: 'admin@caothang.edu.vn',
        fullName: 'Quản trị viên (Hệ thống)',
        mssv: 'ADMIN-001',
        department: 'Hội Sinh Viên',
        classCode: 'HSV',
        role: 'ADMIN'
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
      return adminUser;
    }

    const users = mockAuthService.getUsers();
    const user = users.find(u => u.email === email && u.mssv === mssv);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  updateUser: (updatedUser: User): void => {
    const users = mockAuthService.getUsers();
    const index = users.findIndex(u => u.uid === updatedUser.uid);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
};

export const mockSV5TService = {
  getConfig: (): CriterionConfig[] => {
    const data = localStorage.getItem(CONFIG_KEY);
    return data ? JSON.parse(data) : DEFAULT_CRITERIA;
  },

  updateConfig: (config: CriterionConfig[]) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  },

  submitApplication: (user: User, criteria: CriterionItem[]) => {
    const apps = mockSV5TService.getApplications();
    const newApp: SV5TCriteria = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      userName: user.fullName,
      userMssv: user.mssv,
      criteria,
      submittedAt: new Date().toISOString(),
      status: 'PENDING'
    };
    // Remove old app if exists
    const filtered = apps.filter(a => a.userId !== user.uid);
    filtered.push(newApp);
    localStorage.setItem(SV5T_KEY, JSON.stringify(filtered));
    return newApp;
  },

  getApplications: (): SV5TCriteria[] => {
    const data = localStorage.getItem(SV5T_KEY);
    return data ? JSON.parse(data) : [];
  },

  getUserApplication: (userId: string): SV5TCriteria | null => {
    const apps = mockSV5TService.getApplications();
    return apps.find(a => a.userId === userId) || null;
  },

  updateApplication: (app: SV5TCriteria): void => {
    const apps = mockSV5TService.getApplications();
    const index = apps.findIndex(a => a.id === app.id);
    if (index !== -1) {
      apps[index] = app;
      localStorage.setItem(SV5T_KEY, JSON.stringify(apps));
    }
  },

  updateStatus: (appId: string, status: SV5TCriteria['status'], feedback?: string) => {
    const apps = mockSV5TService.getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.status = status;
      if (feedback) app.adminFeedback = feedback;
      localStorage.setItem(SV5T_KEY, JSON.stringify(apps));
    }
  },

  getStats: () => {
    const apps = mockSV5TService.getApplications();
    const users = mockAuthService.getUsers();
    
    // Status distribution
    const byStatus = [
      { name: 'Chờ duyệt', value: apps.filter(a => a.status === 'PENDING').length },
      { name: 'Đạt 5 Tốt', value: apps.filter(a => a.status === 'APPROVED').length },
      { name: 'Bổ sung', value: apps.filter(a => a.status === 'SUPPLEMENT_REQUIRED').length },
      { name: 'Không đạt', value: apps.filter(a => a.status === 'REJECTED').length },
    ];

    // Criteria breakdown (how many people declared each main criteria)
    const criteriaBreakdown = [
      { name: 'Đạo đức', count: apps.filter(a => a.criteria.find(c => c.id === 'ethics' && c.subItems?.some(s => s.isMet))?.isMet || false).length },
      { name: 'Học tập', count: apps.filter(a => a.criteria.find(c => c.id === 'academic')?.subItems?.some(s => s.isMet)).length },
      { name: 'Thể lực', count: apps.filter(a => a.criteria.find(c => c.id === 'physical')?.subItems?.some(s => s.isMet)).length },
      { name: 'Kỹ năng', count: apps.filter(a => a.criteria.find(c => c.id === 'skills')?.subItems?.some(s => s.isMet)).length },
      { name: 'Hội nhập', count: apps.filter(a => a.criteria.find(c => c.id === 'integration')?.subItems?.some(s => s.isMet)).length },
    ];

    return {
      totalUsers: users.length,
      totalApps: apps.length,
      pending: apps.filter(a => a.status === 'PENDING').length,
      approved: apps.filter(a => a.status === 'APPROVED').length,
      supplement: apps.filter(a => a.status === 'SUPPLEMENT_REQUIRED').length,
      rejected: apps.filter(a => a.status === 'REJECTED').length,
      byStatus,
      criteriaBreakdown
    };
  }
};

export const mockCertificateService = {
  lookupByMSSV: (mssv: string): VolunteerCertificate[] => {
    // In a real app, this would be a server-side lookup
    // For now, we search our mock list
    return MOCK_CERTIFICATES.filter(c => c.mssv === mssv);
  }
};
