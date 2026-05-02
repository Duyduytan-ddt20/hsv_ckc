import { User, SV5TCriteria, VolunteerCertificate, CriterionConfig, CriterionItem, Article, SiteSettings, SocialTrend, UsageStat, EmergingIssue, CertificateFolder, CertificateImage, VisitRegistration } from '../types';

const USERS_KEY = 'ct_hsv_users';
const CURRENT_USER_KEY = 'ct_hsv_current_user';
const SV5T_KEY = 'ct_hsv_sv5t';
const CONFIG_KEY = 'ct_hsv_config';
const FOLDERS_KEY = 'ct_certificate_folders';
const VISITS_KEY = 'ct_visit_registrations';

const initialVisits: VisitRegistration[] = [
  {
    id: 'v1',
    visitTime: '2026-05-15T09:00',
    studentCount: 50,
    organization: 'Đoàn trường ĐH Bách Khoa',
    leaderName: 'Nguyễn Văn Nam',
    leaderPhone: '0901234567',
    proposalFileUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
    status: 'PENDING',
    createdAt: '2026-05-01'
  }
];

const initialFolders: CertificateFolder[] = [
  {
    id: 'f1',
    name: 'Chiến dịch Mùa Hè Xanh 2025',
    description: 'Giấy chứng nhận tham gia chiến dịch tình nguyện hè 2025.',
    createdAt: '2025-08-15',
    certificates: [
      { id: 'c1', studentName: 'Nguyễn Văn Anh', imageUrl: 'https://images.unsplash.com/photo-1544652271-629a8412869a?w=800&q=80', issueDate: '2025-08-20' },
      { id: 'c2', studentName: 'Trần Thị Bình', imageUrl: 'https://images.unsplash.com/photo-1544652271-629a8412869a?w=800&q=80', issueDate: '2025-08-20' },
    ]
  },
  {
    id: 'f2',
    name: 'Ngày hội Sinh viên khỏe 2026',
    description: 'Chứng nhận hoàn thành các tiêu chí thể lực.',
    createdAt: '2026-03-10',
    certificates: [
      { id: 'c3', studentName: 'Nguyễn Văn Anh', imageUrl: 'https://images.unsplash.com/photo-1544652271-629a8412869a?w=800&q=80', issueDate: '2026-03-12' },
    ]
  }
];

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
  heroSubtitle: 'Đoàn kết - Sáng tạo - Xung kích - Hội nhập',
  introContent: `Hội Sinh viên Việt Nam trường Cao đẳng Kỹ thuật Cao Thắng là tổ chức chính trị - xã hội của sinh viên trường, hoạt động dưới sự lãnh đạo của Đảng ủy nhà trường và sự hướng dẫn của Hội Sinh viên Thành phố.\n\nVới phương châm "Đoàn kết - Sáng tạo - Xung kích - Hội nhập", Hội Sinh viên trường luôn nỗ lực tạo ra môi trường rèn luyện tốt nhất cho sinh viên thông qua các phong trào trọng tâm, đặc biệt là phong trào "Sinh viên 5 tốt".`,
  footerText: '© 2026 Hội Sinh Viên Trường Cao Đẳng Kỹ Thuật Cao Thắng',
  contactEmail: 'hoisinhvien@caothang.edu.vn',
  contactPhone: '028 3821 2360',
  address: '65 Huỳnh Thúc Kháng, P.Bến Nghé, Quận 1, TP.HCM'
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
    if (settings.introContent === undefined) settings.introContent = DEFAULT_SETTINGS.introContent;
    if (settings.footerText === undefined) settings.footerText = DEFAULT_SETTINGS.footerText;
    if (settings.contactEmail === undefined) settings.contactEmail = DEFAULT_SETTINGS.contactEmail;
    if (settings.contactPhone === undefined) settings.contactPhone = DEFAULT_SETTINGS.contactPhone;
    if (settings.address === undefined) settings.address = DEFAULT_SETTINGS.address;
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
          uid: 'admin-main',
          email: 'hoisinhvien@caothang.edu.vn',
          fullName: 'Hội Sinh Viên Cao Thắng',
          mssv: 'ADMIN-HSV',
          department: 'Hội Sinh Viên',
          classCode: 'HSV',
          role: 'ADMIN'
        },
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
          uid: 'admin-main',
          email: 'hoisinhvien@caothang.edu.vn',
          fullName: 'Hội Sinh Viên Cao Thắng',
          mssv: 'ADMIN-HSV',
          department: 'Hội Sinh Viên',
          classCode: 'HSV',
          role: 'ADMIN',
          password: 'nhiemky6' // Adding password field to mock data for simplicity
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
    // Special admin login requested by user
    if (email === 'hoisinhvien@caothang.edu.vn' && mssv === 'nhiemky6') {
      const users = mockAuthService.getUsers();
      const admin = users.find(u => u.email === email) || {
        uid: 'admin-main',
        email: 'hoisinhvien@caothang.edu.vn',
        fullName: 'Hội Sinh Viên Cao Thắng',
        mssv: 'ADMIN-HSV',
        department: 'Hội Sinh Viên',
        classCode: 'HSV',
        role: 'ADMIN'
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(admin));
      return admin as User;
    }

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

  deleteUser: (uid: string): void => {
    const users = mockAuthService.getUsers();
    const filtered = users.filter(u => u.uid !== uid);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  updateUserRole: (uid: string, role: 'USER' | 'ADMIN'): void => {
    const users = mockAuthService.getUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index !== -1) {
      users[index].role = role;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
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
  },

  deleteApplication: (id: string) => {
    const apps = mockSV5TService.getApplications();
    const filtered = apps.filter(a => a.id !== id);
    localStorage.setItem(SV5T_KEY, JSON.stringify(filtered));
  }
};

export const mockSocialService = {
  getSocialTrends: (): SocialTrend[] => [
    { id: '1', topic: 'Kỳ thi THPT Quốc gia', hashtag: '#THPTQG2026', volume: '25.4K', sentiment: 'POSITIVE', change: '+12%' },
    { id: '2', topic: 'Hội trại 26/03', hashtag: '#HoitraiCaoThang', volume: '15.2K', sentiment: 'POSITIVE', change: '+45%' },
    { id: '3', topic: 'Tăng học phí dự kiến', hashtag: '#Hocphi2026', volume: '10.8K', sentiment: 'NEGATIVE', change: '+85%' },
    { id: '4', topic: 'Giải bóng đá Sinh viên', hashtag: '#SVFootball', volume: '8.4K', sentiment: 'POSITIVE', change: '+5%' },
    { id: '5', topic: 'Vấn đề bãi xe cơ sở 2', hashtag: '#ParkingIssues', volume: '5.1K', sentiment: 'NEUTRAL', change: '-2%' },
  ],

  getUsageStats: (): UsageStat[] => [
    { platform: 'Facebook', users: 8500, avgTime: 120, color: '#1877F2' },
    { platform: 'TikTok', users: 7200, avgTime: 180, color: '#000000' },
    { platform: 'YouTube', users: 6800, avgTime: 95, color: '#FF0000' },
    { platform: 'Instagram', users: 4500, avgTime: 45, color: '#E4405F' },
    { platform: 'Zalo', users: 9000, avgTime: 60, color: '#0068FF' },
  ],

  getEmergingIssues: (): EmergingIssue[] => [
    { 
      id: '1', 
      title: 'Tin giả về lịch nghỉ lễ', 
      description: 'Nhiều trang fanpage không chính thống đăng tải sai lệch về thời gian nghỉ lễ 30/4 - 1/5.',
      source: 'Facebook Group "Sinh viên Cao Thắng"',
      urgency: 'HIGH',
      timestamp: '10 phút trước'
    },
    { 
      id: '2', 
      title: 'Phản ánh chất lượng Wifi', 
      description: 'Khu vực dãy nhà C báo cáo kết nối chậm trong giờ cao điểm.',
      source: 'Hệ thống Feedback',
      urgency: 'MEDIUM',
      timestamp: '1 giờ trước'
    },
    { 
      id: '3', 
      title: 'Trend TikTok "Một ngày đi học"', 
      description: 'Sinh viên đang tích cực quay clip quảng bá hình ảnh nhà trường.',
      source: 'TikTok',
      urgency: 'LOW',
      timestamp: '3 giờ trước'
    }
  ]
};

export const mockCertificateService = {
  getFolders: (): CertificateFolder[] => {
    const saved = localStorage.getItem(FOLDERS_KEY);
    return saved ? JSON.parse(saved) : initialFolders;
  },

  saveFolders: (folders: CertificateFolder[]) => {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  },

  searchByName: (name: string): (CertificateImage & { folderName: string })[] => {
    const folders = mockCertificateService.getFolders();
    const results: (CertificateImage & { folderName: string })[] = [];
    
    const searchLower = name.toLowerCase().trim();
    if (!searchLower) return [];

    folders.forEach(folder => {
      folder.certificates.forEach(cert => {
        if (cert.studentName.toLowerCase().includes(searchLower)) {
          results.push({ ...cert, folderName: folder.name });
        }
      });
    });
    
    return results;
  }
};

export const mockVisitService = {
  getRegistrations: (): VisitRegistration[] => {
    const saved = localStorage.getItem(VISITS_KEY);
    return saved ? JSON.parse(saved) : initialVisits;
  },

  submitRegistration: (data: Omit<VisitRegistration, 'id' | 'status' | 'createdAt'>): VisitRegistration => {
    const registrations = mockVisitService.getRegistrations();
    const newReg: VisitRegistration = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newReg, ...registrations];
    localStorage.setItem(VISITS_KEY, JSON.stringify(updated));
    return newReg;
  },

  updateStatus: (id: string, status: 'APPROVED' | 'REJECTED'): void => {
    const registrations = mockVisitService.getRegistrations();
    const updated = registrations.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem(VISITS_KEY, JSON.stringify(updated));
  },

  deleteRegistration: (id: string): void => {
    const registrations = mockVisitService.getRegistrations();
    const updated = registrations.filter(r => r.id !== id);
    localStorage.setItem(VISITS_KEY, JSON.stringify(updated));
  }
};

