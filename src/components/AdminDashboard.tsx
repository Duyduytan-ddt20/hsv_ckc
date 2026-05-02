import React, { useState, useEffect } from 'react';
import { User, SV5TCriteria, CriterionConfig, CriterionItem, Article, SiteSettings, SocialTrend, UsageStat, EmergingIssue, CertificateFolder, CertificateImage, VisitRegistration } from '../types';
import { mockSV5TService, mockAuthService, mockAdminService, mockSocialService, mockCertificateService, mockVisitService } from '../services/mockDataService';
import { Users, FileText, CheckCircle, Clock, XCircle, Settings, BarChart3, ChevronRight, Check, X, MessageSquare, Plus, Trash2, Edit3, Image as ImageIcon, Layout, AlertCircle, User as UserIcon, Mail, Phone, TrendingUp, Hash, Globe, Activity, Smartphone, Monitor, Folder, Upload, Trash, Download, Award, History, Eye, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

type AdminTab = 'OVERVIEW' | 'APPLICATIONS' | 'ARTICLES' | 'USER_MANAGEMENT' | 'SITE_SETTINGS' | 'CRITERIA' | 'CERTIFICATE_MANAGEMENT' | 'VISIT_MANAGEMENT';

interface AdminDashboardProps {
  settings: SiteSettings;
  onSettingsUpdate: (settings: SiteSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ settings: siteSettings, onSettingsUpdate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [stats, setStats] = useState(mockSV5TService.getStats());
  const [apps, setApps] = useState(mockSV5TService.getApplications());
  const [articles, setArticles] = useState(mockAdminService.getArticles());
  const [allUsers, setAllUsers] = useState(mockAuthService.getUsers());
  // Removed local siteSettings state as it's now a prop
  const [localSettings, setLocalSettings] = useState<SiteSettings>(siteSettings);
  const [config, setConfig] = useState(mockSV5TService.getConfig());
  
  const [socialTrends] = useState<SocialTrend[]>(mockSocialService.getSocialTrends());
  const [usageStats] = useState<UsageStat[]>(mockSocialService.getUsageStats());
  const [emergingIssues] = useState<EmergingIssue[]>(mockSocialService.getEmergingIssues());
  
  const [folders, setFolders] = useState<CertificateFolder[]>(mockCertificateService.getFolders());
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  
  const [registrations, setRegistrations] = useState<VisitRegistration[]>(mockVisitService.getRegistrations());
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
  
  const [selectedApp, setSelectedApp] = useState<SV5TCriteria | null>(null);
  const [adminFeedback, setAdminFeedback] = useState('');
  
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', mssv: '', department: '', classCode: '', phoneNumber: '' });
  const [userSearchQuery, setUserSearchQuery] = useState('');

  useEffect(() => {
    setStats(mockSV5TService.getStats());
    setAllUsers(mockAuthService.getUsers());
  }, [apps, activeTab]);

  useEffect(() => {
    if (selectedApp) {
      setAdminFeedback(selectedApp.adminFeedback || '');
    }
  }, [selectedApp]);

  // Handlers
  const handleUpdateStatus = (appId: string, status: SV5TCriteria['status']) => {
    if (!selectedApp) return;
    const updatedApp = { ...selectedApp, status, adminFeedback };
    mockSV5TService.updateApplication(updatedApp);
    setApps(mockSV5TService.getApplications());
    setSelectedApp(null);
  };

  const updateSubItemFeedback = (parentId: string, subId: string, feedback: string) => {
    if (!selectedApp) return;
    const newCriteria = selectedApp.criteria.map(p => {
      if (p.id === parentId && p.subItems) {
        return {
          ...p,
          subItems: p.subItems.map(s => s.id === subId ? { ...s, feedback } : s)
        };
      }
      return p;
    });
    setSelectedApp({ ...selectedApp, criteria: newCriteria });
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      mockAdminService.saveArticle(editingArticle);
      setArticles(mockAdminService.getArticles());
      setEditingArticle(null);
    }
  };

  const handleDeleteUser = (uid: string) => {
    if (uid === 'admin-main') return alert('Không thể xóa tài khoản admin chính!');
    if (confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      mockAuthService.deleteUser(uid);
      setAllUsers(mockAuthService.getUsers());
    }
  };

  const handleToggleRole = (uid: string, currentRole: 'USER' | 'ADMIN') => {
    if (uid === 'admin-main') return alert('Không thể thay đổi vai trò của admin chính!');
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (confirm(`Chuyển vai trò sang ${newRole}?`)) {
      mockAuthService.updateUserRole(uid, newRole);
      setAllUsers(mockAuthService.getUsers());
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    // Using direct update to avoid auto-login side effect of mockAuthService.register
    const users = mockAuthService.getUsers();
    const newUserObj: User = { 
      ...newUser, 
      uid: Math.random().toString(36).substr(2, 9), 
      role: 'USER' 
    } as User;
    
    const USERS_KEY = 'hsv_users_v1';
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUserObj]));
    
    setAllUsers(mockAuthService.getUsers());
    setIsAddingUser(false);
    setNewUser({ fullName: '', email: '', mssv: '', department: '', classCode: '', phoneNumber: '' });
    alert('Đã tạo tài khoản thành công!');
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      mockAuthService.updateUser(editingUser);
      setAllUsers(mockAuthService.getUsers());
      setEditingUser(null);
      alert('Đã cập nhật thông tin tài khoản!');
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.mssv.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleSaveSettings = () => {
    if (!localSettings.topBannerUrl) {
      alert('Vui lòng chọn ảnh banner!');
      return;
    }
    
    try {
      mockAdminService.updateSettings(localSettings);
      onSettingsUpdate(localSettings);
      alert('Đã lưu cài đặt giao diện thành công! Vui lòng quay lại trang chủ để xem thay đổi.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Lỗi: Không thể lưu cài đặt. Có thể do kích thước ảnh quá lớn (vượt quá 5MB tổng cộng). Hãy thử dùng ảnh nén hoặc URL ảnh.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldOrSetter: keyof SiteSettings | ((val: string) => void)) => {
    const file = e.target.files?.[0];
    if (file) {
      // Size check for localStorage resilience (recommend < 1.5MB for base64 safety)
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước ảnh quá lớn (>2MB)! Vui lòng chọn ảnh nhẹ hơn để hệ thống hoạt động ổn định.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (typeof fieldOrSetter === 'function') {
          fieldOrSetter(result);
        } else {
          setLocalSettings(prev => ({ ...prev, [fieldOrSetter]: result }));
        }
      };
      reader.onerror = () => alert('Lỗi khi tải ảnh lên.');
      reader.readAsDataURL(file);
    }
  };

  const handleResetSettings = () => {
    if (confirm('Bạn có chắc muốn đặt lại giao diện về mặc định?')) {
      const defaultSettings = mockAdminService.getSettings(); // This gets from JS default if localStorage is cleared or default provided
      // Actually we should pull the default constants from mockDataService if we wanted true reset
      // For now let's just clear specific fields if needed or skip
      alert('Chức năng đang được cập nhật.');
    }
  };

  const toggleItemStatus = (parentId: string, subId: string, status: 'APPROVED' | 'MISSING' | 'PENDING') => {
    if (!selectedApp) return;
    const newCriteria = selectedApp.criteria.map(p => {
      if (p.id === parentId && p.subItems) {
        return {
          ...p,
          subItems: p.subItems.map(s => s.id === subId ? { ...s, status } : s)
        };
      }
      return p;
    });
    setSelectedApp({ ...selectedApp, criteria: newCriteria });
  };
  const SidebarItem: React.FC<{ tab: AdminTab, icon: any, label: string }> = ({ tab, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
        activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex flex-col gap-2">
            <SidebarItem tab="OVERVIEW" icon={Layout} label="Bảng điều khiển" />
            <SidebarItem tab="APPLICATIONS" icon={FileText} label="Hồ sơ SV 5 Tốt" />
            <SidebarItem tab="ARTICLES" icon={MessageSquare} label="Bài viết & Tin tức" />
            <SidebarItem tab="CERTIFICATE_MANAGEMENT" icon={Award} label="Quản lý chứng nhận" />
            <SidebarItem tab="VISIT_MANAGEMENT" icon={History} label="Quản lý tham quan" />
            <SidebarItem tab="USER_MANAGEMENT" icon={Users} label="Quản lý tài khoản" />
            <SidebarItem tab="SITE_SETTINGS" icon={Settings} label="Cài đặt hệ thống" />
            <SidebarItem tab="CRITERIA" icon={Settings} label="Cấu hình tiêu chí" />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'OVERVIEW' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">🚀 Dashboard Trung Tâm</h2>
                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Giám sát hệ thống & Xu hướng mạng xã hội thời gian thực</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Admin${i}`} alt="Admin" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">+5</div>
                    </div>
                    <div className="h-10 w-px bg-slate-200 mx-2"></div>
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-100">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> Hệ thống ổn định
                    </span>
                  </div>
                </div>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left Column: Stats Cards */}
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    {[
                      { label: 'Hội viên tham gia', value: stats.totalUsers, icon: Users, color: 'text-blue-600', trend: '+12% tuần này' },
                      { label: 'Hồ sơ SV5T nộp', value: stats.totalApps, icon: FileText, color: 'text-purple-600', trend: '+5% hôm nay' },
                      { label: 'Yêu cầu chờ duyệt', value: stats.pending, icon: Clock, color: 'text-amber-600', trend: '-2% tồn kho' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all">
                        <div className="relative z-10">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                          <div className={`text-4xl font-black ${item.color} tracking-tighter`}>{item.value.toLocaleString()}</div>
                          <div className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> {item.trend}
                          </div>
                        </div>
                        <item.icon className="absolute bottom-[-10px] right-[-10px] h-20 w-20 text-slate-100 opacity-50 group-hover:scale-110 transition-transform" />
                      </div>
                    ))}
                  </div>

                  {/* Middle Column: Social Radar & Usage */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl h-full flex flex-col">
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                          <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2 text-blue-400">
                            <Globe className="h-6 w-6" /> Social Connect Radar
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dữ liệu truy cập internet sinh viên</p>
                        </div>
                        <div className="flex gap-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-1 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col md:flex-row items-center gap-8 justify-center min-h-[300px]">
                        <div className="w-full h-full max-w-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={usageStats}>
                              <PolarGrid stroke="#334155" />
                              <PolarAngleAxis dataKey="platform" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'black' }} />
                              <Radar name="Người dùng" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '15px', color: '#fff' }} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="flex flex-col gap-4 w-full md:w-48">
                          {usageStats.map((stat) => (
                            <div key={stat.platform} className="flex flex-col gap-1">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span style={{ color: stat.color }}>{stat.platform}</span>
                                <span className="text-slate-400">{((stat.users / usageStats.reduce((a,b) => a + b.users, 0)) * 100).toFixed(0)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(stat.users / 10000) * 100}%` }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: stat.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-blue-400" />
                            <span className="text-xs font-bold text-slate-300">Mobile: 86%</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Monitor className="h-4 w-4 text-blue-400" />
                             <span className="text-xs font-bold text-slate-300">Desktop: 14%</span>
                          </div>
                        </div>
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">Scanning Network...</div>
                      </div>

                      {/* Decorator */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                    </div>
                  </div>

                  {/* Right Column: Emerging Issues Card */}
                  <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm h-full flex flex-col relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter italic">
                          <Activity className="h-6 w-6 text-red-600" /> Hot Issues
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                      </div>
                      
                      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                        {emergingIssues.map((issue) => (
                          <div key={issue.id} className="p-5 bg-slate-50 rounded-[2.2rem] border border-slate-100 hover:border-red-200 transition-all group relative overflow-hidden">
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                  issue.urgency === 'HIGH' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                                }`}>
                                  {issue.urgency}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400">{issue.timestamp}</span>
                              </div>
                              <h4 className="font-black text-slate-900 text-xs leading-tight mb-2">{issue.title}</h4>
                              <p className="text-[10px] text-slate-500 line-clamp-2 italic">"{issue.description}"</p>
                              <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase">
                                <Globe className="h-3 w-3" /> {issue.source}
                              </div>
                            </div>
                            <div className="absolute bottom-[-20px] right-[-20px] w-16 h-16 bg-red-600/5 rounded-full"></div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
                        <button className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-slate-100">
                          Xử lý vấn đề khẩn cấp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Detailed Analysis Expansion */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Trends Table Section */}
                  <div className="lg:col-span-2 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter italic">
                          <TrendingUp className="h-8 w-8 text-blue-600" /> Phân tích xu hướng MXH
                        </h3>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest ml-11">Top hashtag & sentiment analysis</p>
                      </div>
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button className="px-4 py-1.5 bg-white text-[10px] font-black uppercase rounded-lg shadow-sm">Báo cáo tuần</button>
                        <button className="px-4 py-1.5 text-[10px] font-black uppercase text-slate-400">Lịch sử</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        {socialTrends.map((trend) => (
                          <div key={trend.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all hover:scale-[1.02] cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-black">
                                <Hash className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="text-sm font-black text-slate-900">{trend.topic}</div>
                                <div className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">{trend.hashtag}</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-xs font-black text-slate-900">{trend.volume}</div>
                              <div className={`text-[10px] font-bold flex items-center gap-1 ${trend.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                {trend.change.startsWith('+') ? '↑' : '↓'} {trend.change}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-50 p-6 rounded-[2.5rem] flex flex-col justify-between border border-slate-100">
                         <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Môi trường phản hồi (Sentiment)</h4>
                            <div className="flex items-end gap-3 h-32 px-4">
                               <div className="flex-1 flex flex-col gap-2">
                                  <div className="w-full bg-emerald-500 rounded-t-xl" style={{ height: '70%' }}></div>
                                  <span className="text-[8px] font-black text-center text-slate-400">Cực tốt</span>
                               </div>
                               <div className="flex-1 flex flex-col gap-2">
                                  <div className="w-full bg-amber-400 rounded-t-xl" style={{ height: '20%' }}></div>
                                  <span className="text-[8px] font-black text-center text-slate-400">Trung lập</span>
                               </div>
                               <div className="flex-1 flex flex-col gap-2">
                                  <div className="w-full bg-red-500 rounded-t-xl" style={{ height: '10%' }}></div>
                                  <span className="text-[8px] font-black text-center text-slate-400">Tiêu cực</span>
                               </div>
                            </div>
                         </div>
                         <div className="mt-8 pt-6 border-t border-slate-200">
                            <p className="text-[10px] text-slate-500 font-bold italic leading-relaxed">"Phần lớn sinh viên có phản hồi tích cực về sự kiện Hội trại 26/03, tuy nhiên cần lưu ý về phản hồi tăng học phí dự kiến."</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* System Health / Apps Summary */}
                  <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tighter italic">
                      <BarChart3 className="h-6 w-6 text-purple-600" /> Trạng thái hồ sơ
                    </h3>
                    
                    <div className="flex-1 space-y-8 flex flex-col justify-center">
                       <div className="relative h-48 w-48 mx-auto">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={stats.byStatus}
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={8}
                                dataKey="value"
                              >
                                <Cell fill="#f59e0b" />
                                <Cell fill="#10b981" />
                                <Cell fill="#ef4444" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-slate-900">{stats.totalApps}</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Hồ sơ</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-emerald-50 p-4 rounded-2xl flex flex-col items-center border border-emerald-100/50">
                             <div className="text-xl font-black text-emerald-600">{apps.filter(a => a.status === 'APPROVED').length}</div>
                             <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Hợp lệ</div>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-2xl flex flex-col items-center border border-amber-100/50">
                             <div className="text-xl font-black text-amber-600">{stats.pending}</div>
                             <div className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Đang chờ</div>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab('APPLICATIONS')}
                      className="mt-8 group flex items-center justify-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:gap-4 transition-all"
                    >
                      Kiểm duyệt hồ sơ <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'APPLICATIONS' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-3xl font-black mb-8 text-slate-900 uppercase tracking-tighter">📄 Quản lý hồ sơ</h2>
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-4 font-bold text-slate-400 text-[10px] uppercase">Họ tên sinh viên</th>
                          <th className="px-8 py-4 font-bold text-slate-400 text-[10px] uppercase">Trạng thái</th>
                          <th className="px-8 py-4 font-bold text-slate-400 text-[10px] uppercase text-right">Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {apps.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50 group">
                            <td className="px-8 py-4">
                              <div className="font-bold text-slate-900">{app.userName}</div>
                              <div className="text-[10px] text-slate-400">{app.userMssv}</div>
                            </td>
                            <td className="px-8 py-4">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                                app.status === 'SUPPLEMENT_REQUIRED' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {app.status === 'PENDING' ? 'Chờ duyệt' : 
                                 app.status === 'APPROVED' ? 'Hợp lệ' : 
                                 app.status === 'REJECTED' ? 'Từ chối' : 'Cần bổ sung'}
                              </span>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <button onClick={() => setSelectedApp(app)} className="text-blue-600 font-bold text-xs hover:underline">Xem hồ sơ</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ARTICLES' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">📰 Bài viết tin tức</h2>
                  <button 
                    onClick={() => setEditingArticle({ id: Math.random().toString(36).substr(2, 9), title: '', content: '', date: new Date().toISOString().split('T')[0], views: 0, authorId: 'admin' })}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
                  >
                    <Plus className="h-5 w-5" />
                    Viết bài mới
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {articles.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-[2rem] border border-slate-100 text-slate-400 font-medium">Chưa có bài viết nào.</div>
                  ) : articles.map(article => (
                    <div key={article.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                           {article.imageUrl ? <img src={article.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-300" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{article.title}</h3>
                          <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            <span>📅 {article.date}</span>
                            <span>👁️ {article.views} lượt xem</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingArticle(article)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit3 className="h-5 w-5" /></button>
                        <button onClick={() => { mockAdminService.deleteArticle(article.id); setArticles(mockAdminService.getArticles()); }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'CERTIFICATE_MANAGEMENT' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">🏆 Quản lý chứng nhận</h2>
                  <button 
                    onClick={() => setIsAddingFolder(true)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Plus className="h-4 w-4" /> Tạo đợt cấp mới
                  </button>
                </div>

                {isAddingFolder && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8">
                    <h3 className="text-xl font-black mb-6">Tạo thư mục chứng nhận mới</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <input 
                        type="text" 
                        placeholder="Tên đợt cấp (VD: Mùa Hè Xanh 2025)"
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Mô tả ngắn"
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold"
                        value={newFolderDesc}
                        onChange={(e) => setNewFolderDesc(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          if (!newFolderName) return;
                          const newFolder: CertificateFolder = {
                            id: Math.random().toString(36).substr(2, 9),
                            name: newFolderName,
                            description: newFolderDesc,
                            createdAt: new Date().toISOString().split('T')[0],
                            certificates: []
                          };
                          const updated = [newFolder, ...folders];
                          setFolders(updated);
                          mockCertificateService.saveFolders(updated);
                          setIsAddingFolder(false);
                          setNewFolderName('');
                          setNewFolderDesc('');
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                      >
                        Lưu thư mục
                      </button>
                      <button 
                        onClick={() => setIsAddingFolder(false)}
                        className="bg-slate-100 text-slate-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Folder List */}
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Danh sách thư mục</h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {folders.map(folder => (
                        <div 
                          key={folder.id}
                          onClick={() => setSelectedFolderId(folder.id)}
                          className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${
                            selectedFolderId === folder.id 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' 
                              : 'bg-white border-slate-100 text-slate-900 hover:border-blue-200'
                          }`}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedFolderId === folder.id ? 'bg-white/20' : 'bg-blue-50'}`}>
                              <Folder className={`h-6 w-6 ${selectedFolderId === folder.id ? 'text-white' : 'text-blue-600'}`} />
                            </div>
                            <div>
                              <div className="font-black text-sm uppercase tracking-tight">{folder.name}</div>
                              <div className={`text-[10px] font-bold ${selectedFolderId === folder.id ? 'text-blue-200' : 'text-slate-400'}`}>
                                {folder.certificates?.length || 0} chứng nhận • {folder.createdAt}
                              </div>
                            </div>
                          </div>
                          <p className={`text-[10px] font-medium leading-relaxed italic line-clamp-2 ${selectedFolderId === folder.id ? 'text-blue-100' : 'text-slate-400'}`}>
                            {folder.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Folder Details / Certificate Management */}
                  <div className="lg:col-span-2">
                    {selectedFolderId ? (
                      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm min-h-[500px]">
                        {folders.find(f => f.id === selectedFolderId) && (
                          <>
                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                              <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase">
                                  {folders.find(f => f.id === selectedFolderId)?.name}
                                </h3>
                                <p className="text-xs font-bold text-slate-400">Quản lý danh sách chứng nhận trong thư mục này</p>
                              </div>
                              <button 
                                onClick={() => {
                                  if (confirm('Bạn có chắc muốn xóa thư mục này và tất cả chứng nhận bên trong?')) {
                                    const updated = folders.filter(f => f.id !== selectedFolderId);
                                    setFolders(updated);
                                    mockCertificateService.saveFolders(updated);
                                    setSelectedFolderId(null);
                                  }
                                }}
                                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>

                            {/* Upload Simulation */}
                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8">
                               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Thêm chứng nhận mới vào hệ thống</h4>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-1">
                                     <label className="text-[9px] font-black text-slate-400 uppercase px-2">Họ tên sinh viên</label>
                                     <input 
                                       type="text" 
                                       placeholder="VD: Nguyễn Văn Anh"
                                       className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm font-bold shadow-sm"
                                       value={uploadName}
                                       onChange={(e) => setUploadName(e.target.value)}
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[9px] font-black text-slate-400 uppercase px-2">URL ảnh (Link ảnh online)</label>
                                     <input 
                                       type="text" 
                                       placeholder="Link ảnh minh chứng..."
                                       className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm font-bold shadow-sm"
                                       value={uploadUrl}
                                       onChange={(e) => setUploadUrl(e.target.value)}
                                     />
                                  </div>
                               </div>
                               <button 
                                 onClick={() => {
                                    if (!uploadName) return;
                                    const newCert: CertificateImage = {
                                      id: Math.random().toString(36).substr(2, 9),
                                      studentName: uploadName,
                                      imageUrl: uploadUrl || 'https://images.unsplash.com/photo-1544652271-629a8412869a?w=800&q=80',
                                      issueDate: new Date().toISOString().split('T')[0]
                                    };
                                    const updated = folders.map(f => {
                                      if (f.id === selectedFolderId) {
                                        return { ...f, certificates: [newCert, ...(f.certificates || [])] };
                                      }
                                      return f;
                                    });
                                    setFolders(updated);
                                    mockCertificateService.saveFolders(updated);
                                    setUploadName('');
                                    setUploadUrl('');
                                 }}
                                 className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                               >
                                 <Upload className="h-4 w-4" /> Đưa lên hệ thống tra cứu
                               </button>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                   Dữ liệu hiện có ({folders.find(f => f.id === selectedFolderId)?.certificates?.length || 0})
                                 </h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {folders.find(f => f.id === selectedFolderId)?.certificates?.map(cert => (
                                  <div key={cert.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-lg bg-white p-1 border border-slate-100 overflow-hidden shadow-sm">
                                        <img src={cert.imageUrl} className="w-full h-full object-cover rounded-md" alt={cert.studentName} />
                                      </div>
                                      <div>
                                        <div className="text-xs font-black text-slate-900">{cert.studentName}</div>
                                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{cert.issueDate}</div>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={() => {
                                        const updated = folders.map(f => {
                                          if (f.id === selectedFolderId) {
                                            return { ...f, certificates: (f.certificates || []).filter(c => c.id !== cert.id) };
                                          }
                                          return f;
                                        });
                                        setFolders(updated);
                                        mockCertificateService.saveFolders(updated);
                                      }}
                                      className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                                {(!folders.find(f => f.id === selectedFolderId)?.certificates || folders.find(f => f.id === selectedFolderId)?.certificates.length === 0) && (
                                  <div className="col-span-2 py-12 text-center text-slate-400 italic text-sm">Thư mục chưa có dữ liệu chứng nhận.</div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                           <Folder className="h-10 w-10 opacity-20" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest">Chọn một thư mục để quản lý dữ liệu</p>
                        <p className="text-[10px] font-medium mt-2">Dữ liệu sẽ được lưu trữ để sinh viên tra cứu bằng họ tên</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'VISIT_MANAGEMENT' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                {/* File Preview Modal */}
                <AnimatePresence>
                  {previewFileUrl && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewFileUrl(null)}
                        className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"
                      />
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col"
                      >
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase italic">Xem trước công văn / ảnh minh chứng</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tài liệu đính kèm yêu cầu tham quan</p>
                          </div>
                          <button 
                            onClick={() => setPreviewFileUrl(null)}
                            className="p-4 bg-slate-100 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-slate-50">
                           {previewFileUrl.match(/\.(jpeg|jpg|gif|png|svg)$/) || previewFileUrl.includes('images.unsplash.com') ? (
                             <img src={previewFileUrl} className="w-full h-auto rounded-2xl shadow-lg mx-auto" alt="Preview" />
                           ) : (
                             <iframe src={previewFileUrl} className="w-full h-[600px] rounded-2xl border-none" title="PDF Preview" />
                           )}
                        </div>
                        <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-4">
                           <a 
                             href={previewFileUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all"
                           >
                             <Download className="h-4 w-4" /> Mở trong tab mới
                           </a>
                           <button 
                            onClick={() => setPreviewFileUrl(null)}
                            className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-100"
                           >
                             Đóng bản xem trước
                           </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
                <h2 className="text-3xl font-black mb-8 text-slate-900 uppercase tracking-tighter italic">🏛️ Quản lý Tham quan Không gian truyền thống</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {registrations.length === 0 ? (
                    <div className="bg-white p-20 text-center rounded-[3rem] border border-slate-100 shadow-inner">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                         <History className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 uppercase">Chưa có yêu cầu đăng ký</h3>
                      <p className="text-slate-400 font-medium mt-2 italic text-sm">Các yêu cầu từ sinh viên/đơn vị sẽ xuất hiện tại đây.</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest whitespace-nowrap">Thời gian tham quan</th>
                              <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest whitespace-nowrap">Đơn vị / Trưởng đoàn</th>
                              <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest whitespace-nowrap">Số lượng</th>
                              <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest whitespace-nowrap">Trạng thái</th>
                              <th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest whitespace-nowrap text-right">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {registrations.map((reg) => (
                              <tr key={reg.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-8 py-6">
                                  <div className="font-black text-slate-900 flex items-center gap-2">
                                     <Calendar className="h-4 w-4 text-blue-600" />
                                     {new Date(reg.visitTime).toLocaleString('vi-VN')}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gửi ngày: {reg.createdAt}</div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="font-black text-slate-800 uppercase text-xs">{reg.organization}</div>
                                  <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-500">
                                     <span className="flex items-center gap-1"><UserIcon className="h-3 w-3" /> {reg.leaderName}</span>
                                     <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {reg.leaderPhone}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="bg-blue-50 text-blue-600 font-black px-3 py-1.5 rounded-xl inline-flex items-center gap-2 text-xs">
                                     <Users className="h-3.5 w-3.5" />
                                     {reg.studentCount}
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                                    reg.status === 'APPROVED' ? 'bg-emerald-500 text-white shadow-emerald-100' :
                                    reg.status === 'REJECTED' ? 'bg-red-500 text-white shadow-red-100' : 
                                    'bg-amber-100 text-amber-600'
                                  }`}>
                                    {reg.status === 'PENDING' ? 'Chờ duyệt' : 
                                     reg.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
                                  </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {reg.proposalFileUrl && (
                                       <button 
                                         onClick={() => setPreviewFileUrl(reg.proposalFileUrl)}
                                         className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 font-black text-[9px] uppercase tracking-widest"
                                         title="Xem công văn"
                                       >
                                         <Eye className="h-4 w-4" /> Xem File
                                       </button>
                                    )}
                                    {reg.status === 'PENDING' && (
                                       <>
                                         <button 
                                           onClick={() => {
                                             mockVisitService.updateStatus(reg.id, 'APPROVED');
                                             setRegistrations(mockVisitService.getRegistrations());
                                           }}
                                           className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                                         >
                                           <Check className="h-4 w-4" />
                                         </button>
                                         <button 
                                           onClick={() => {
                                             mockVisitService.updateStatus(reg.id, 'REJECTED');
                                             setRegistrations(mockVisitService.getRegistrations());
                                           }}
                                           className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                         >
                                           <X className="h-4 w-4" />
                                         </button>
                                       </>
                                    )}
                                    <button 
                                      onClick={() => {
                                        if (confirm('Bạn có chắc muốn xóa yêu cầu này?')) {
                                          mockVisitService.deleteRegistration(reg.id);
                                          setRegistrations(mockVisitService.getRegistrations());
                                        }
                                      }}
                                      className="p-2.5 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'USER_MANAGEMENT' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">👥 Quản lý tài khoản</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm tài khoản..." 
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
                        value={userSearchQuery}
                        onChange={e => setUserSearchQuery(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => setIsAddingUser(true)}
                      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg"
                    >
                      <Plus className="h-4 w-4" />
                      Tạo tài khoản
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Sinh viên</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Thông tin học tập</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Liên hệ</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Vai trò</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredUsers.length === 0 ? (
                          <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-medium font-bold italic">Không tìm thấy tài khoản nào phù hợp.</td></tr>
                        ) : filteredUsers.map(user => (
                          <tr key={user.uid} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                     {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon className="h-5 w-5 text-slate-300" />}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900">{user.fullName}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">{user.mssv}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="text-xs font-bold text-slate-700">{user.classCode || 'Chưa cập nhật'}</div>
                               <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{user.department || 'Chưa chọn khoa'}</div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                                  <Mail className="h-3 w-3 text-slate-300" /> {user.email}
                               </div>
                               <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                  <Phone className="h-3 w-3 text-slate-300" /> {user.phoneNumber || 'N/A'}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <button 
                                 onClick={() => handleToggleRole(user.uid, user.role)}
                                 className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                                 user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                               }`}>
                                 {user.role}
                               </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end gap-2">
                                 <button 
                                   onClick={() => setEditingUser(user)}
                                   className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                                 >
                                   <Edit3 className="h-4 w-4" />
                                 </button>
                                 <button 
                                   onClick={() => handleDeleteUser(user.uid)}
                                   className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                 >
                                   <Trash2 className="h-4 w-4" />
                                 </button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'SITE_SETTINGS' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">🎨 Cài đặt website</h2>
                  <button 
                    onClick={handleSaveSettings}
                    className="bg-blue-600 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Check className="h-5 w-5" />
                    LƯU THAY ĐỔI
                  </button>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-10 shadow-sm">
                  {/* Banner Section */}
                  <div className="space-y-6">
                    <div className="flex flex-col">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest px-1 mb-2">Ảnh bìa (Banner chính đầu trang)</label>
                      <div className="flex gap-4">
                        <div className="relative flex-1 group">
                          <input 
                            className="w-full bg-slate-50 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm font-medium truncate"
                            value={localSettings.topBannerUrl || ''}
                            onChange={e => setLocalSettings(prev => ({ ...prev, topBannerUrl: e.target.value }))}
                            placeholder="Dán URL ảnh hoặc tải lên..."
                          />
                        </div>
                        <label className="bg-blue-50 text-blue-600 px-6 rounded-2xl cursor-pointer hover:bg-blue-100 transition-all flex items-center justify-center border border-blue-100 group">
                          <ImageIcon className="h-5 w-5 md:mr-2 group-hover:scale-110 transition-transform" />
                          <span className="hidden md:inline font-bold text-xs uppercase tracking-widest">Tải ảnh lên</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'topBannerUrl')} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Intro Content Section */}
                  <div className="pt-8 border-t border-slate-100 space-y-4">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Nội dung Trang Giới Thiệu</label>
                    <textarea 
                      className="w-full bg-slate-50 p-6 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm font-medium h-48 resize-none"
                      value={localSettings.introContent || ''}
                      onChange={e => setLocalSettings(prev => ({ ...prev, introContent: e.target.value }))}
                      placeholder="Nhập nội dung giới thiệu về Hội Sinh Viên..."
                    />
                  </div>

                  {/* Contact & Footer Section */}
                  <div className="pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Thông tin liên hệ</label>
                      <input 
                        className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm font-medium"
                        value={localSettings.contactEmail || ''}
                        onChange={e => setLocalSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="Email liên hệ..."
                      />
                      <input 
                        className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm font-medium"
                        value={localSettings.contactPhone || ''}
                        onChange={e => setLocalSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                        placeholder="Số điện thoại..."
                      />
                      <input 
                        className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm font-medium"
                        value={localSettings.address || ''}
                        onChange={e => setLocalSettings(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Địa chỉ..."
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Thông tin Footer</label>
                      <textarea 
                        className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm font-medium h-28 resize-none"
                        value={localSettings.footerText || ''}
                        onChange={e => setLocalSettings(prev => ({ ...prev, footerText: e.target.value }))}
                        placeholder="Văn bản cuối trang..."
                      />
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm">
                          {localSettings.logoUrl ? <img src={localSettings.logoUrl} className="max-w-full max-h-full" /> : <ImageIcon className="text-slate-200" />}
                        </div>
                        <input 
                          className="flex-1 bg-transparent text-sm outline-none font-bold"
                          value={localSettings.logoUrl || ''}
                          onChange={e => setLocalSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                          placeholder="Link Logo..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center">
                    <button 
                      onClick={handleSaveSettings}
                      className="w-full md:w-auto bg-blue-600 text-white font-black px-16 py-5 rounded-3xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                    >
                      CẬP NHẬT TOÀN BỘ CÀI ĐẶT
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'CRITERIA' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                 <h2 className="text-3xl font-black mb-8 text-slate-900 uppercase tracking-tighter">⚙️ Cấu hình tiêu chí SV5T</h2>
                 <div className="space-y-6">
                    {config.map((item, idx) => (
                      <div key={item.id} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên tiêu chí</label>
                             <input className="w-full font-bold p-4 bg-slate-50 rounded-2xl outline-none shadow-inner" value={item.label} onChange={e => { let c = [...config]; c[idx].label = e.target.value; setConfig(c); }} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mô tả</label>
                             <input className="w-full text-slate-500 p-4 bg-slate-50 rounded-2xl outline-none shadow-inner" value={item.description} onChange={e => { let c = [...config]; c[idx].description = e.target.value; setConfig(c); }} />
                          </div>
                        </div>
                        <button onClick={() => { mockSV5TService.updateConfig(config); alert('Đã lưu tiêu chí!'); }} className="bg-slate-900 text-white font-bold px-6 py-2 rounded-xl text-xs">Lưu mục này</button>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

          </div>
        </div>

        {/* Article Editor Modal */}
        {editingArticle && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative">
              <button 
                onClick={() => setEditingArticle(null)}
                className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-slate-400" />
              </button>
              <h3 className="text-2xl font-black mb-8 italic">Biên tập bài viết</h3>
              <form onSubmit={handleSaveArticle} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-2">Tiêu đề bài viết</label>
                  <input 
                    className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none shadow-inner" 
                    placeholder="Tiêu đề..."
                    value={editingArticle.title}
                    onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase px-2">Ngày đăng</label>
                    <input 
                      type="date"
                      className="w-full bg-slate-50 p-4 rounded-2xl outline-none shadow-inner" 
                      value={editingArticle.date}
                      onChange={e => setEditingArticle({ ...editingArticle, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase px-2">Lượt xem hiện tại</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 p-4 rounded-2xl outline-none shadow-inner font-mono" 
                      placeholder="Lượt xem..."
                      value={editingArticle.views}
                      onChange={e => setEditingArticle({ ...editingArticle, views: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-2">Ảnh đại diện bài viết</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      className="flex-1 bg-slate-50 p-4 rounded-2xl outline-none shadow-inner text-xs" 
                      placeholder="URL ảnh hoặc tải lên..."
                      value={editingArticle.imageUrl || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, imageUrl: e.target.value })}
                    />
                    <label className="bg-slate-100 p-4 rounded-2xl cursor-pointer hover:bg-slate-200 transition-all">
                      <ImageIcon className="h-5 w-5 text-slate-600" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, (val) => setEditingArticle({ ...editingArticle, imageUrl: val }))} 
                      />
                    </label>
                  </div>
                  {editingArticle.imageUrl && (
                    <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-100">
                      <img src={editingArticle.imageUrl} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-2">Bộ sưu tập ảnh (Gallery)</label>
                  <div className="flex gap-4">
                    <input 
                      id="gallery-input"
                      className="flex-1 bg-slate-50 p-4 rounded-2xl outline-none shadow-inner text-xs" 
                      placeholder="Dán link ảnh vào đây và nhấn Thêm..." 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('gallery-input') as HTMLInputElement;
                        if (input.value) {
                          setEditingArticle({
                            ...editingArticle,
                            gallery: [...(editingArticle.gallery || []), input.value]
                          });
                          input.value = '';
                        }
                      }}
                      className="bg-blue-50 text-blue-600 px-6 rounded-2xl font-bold text-[10px]"
                    >
                      THÊM ẢNH
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {editingArticle.gallery?.map((img, idx) => (
                      <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => {
                            setEditingArticle({
                              ...editingArticle,
                              gallery: editingArticle.gallery?.filter((_, i) => i !== idx)
                            });
                          }}
                          className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-2">Tóm tắt ngắn (Excerpt)</label>
                  <input 
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none shadow-inner text-sm" 
                    placeholder="Tóm tắt nội dung bài viết..."
                    value={editingArticle.excerpt || ''}
                    onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-2">Nội dung chi tiết</label>
                  <textarea 
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none h-48 shadow-inner resize-none" 
                    placeholder="Nội dung..."
                    value={editingArticle.content}
                    onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">LƯU BÀI VIẾT</button>
                  <button type="button" onClick={() => setEditingArticle(null)} className="flex-1 bg-slate-100 text-slate-500 font-bold py-5 rounded-2xl">ĐÓNG</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* User Modal */}
        {(isAddingUser || editingUser) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative">
               <button 
                 onClick={() => { setIsAddingUser(false); setEditingUser(null); }}
                 className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors"
               >
                 <X className="h-6 w-6 text-slate-400" />
               </button>
               <h3 className="text-2xl font-black mb-8 italic">{isAddingUser ? 'Tạo tài khoản mới' : 'Cập nhật tài khoản'}</h3>
               <form onSubmit={isAddingUser ? handleCreateUser : handleUpdateUser} className="space-y-4 text-left">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Họ và tên</label>
                     <input 
                       className="w-full bg-slate-50 p-4 rounded-xl outline-none font-bold shadow-inner" 
                       placeholder="..." 
                       value={isAddingUser ? newUser.fullName : editingUser?.fullName || ''} 
                       onChange={e => isAddingUser ? setNewUser({...newUser, fullName: e.target.value}) : setEditingUser({...editingUser!, fullName: e.target.value})} 
                       required 
                     />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase px-1">MSSV</label>
                     <input 
                       className="w-full bg-slate-50 p-4 rounded-xl outline-none font-bold shadow-inner" 
                       placeholder="..." 
                       value={isAddingUser ? newUser.mssv : editingUser?.mssv || ''} 
                       onChange={e => isAddingUser ? setNewUser({...newUser, mssv: e.target.value}) : setEditingUser({...editingUser!, mssv: e.target.value})} 
                       required 
                     />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Email</label>
                   <input 
                     className="w-full bg-slate-50 p-4 rounded-xl outline-none shadow-inner" 
                     placeholder="email@example.com" 
                     value={isAddingUser ? newUser.email : editingUser?.email || ''} 
                     onChange={e => isAddingUser ? setNewUser({...newUser, email: e.target.value}) : setEditingUser({...editingUser!, email: e.target.value})} 
                     required 
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Khoa</label>
                     <select 
                       className="w-full bg-slate-50 p-4 rounded-xl outline-none shadow-inner text-sm font-bold"
                       value={isAddingUser ? newUser.department : editingUser?.department || ''}
                       onChange={e => isAddingUser ? setNewUser({...newUser, department: e.target.value}) : setEditingUser({...editingUser!, department: e.target.value})}
                       required
                     >
                       <option value="">Chọn khoa...</option>
                       <option value="Công nghệ Thông tin">Công nghệ Thông tin</option>
                       <option value="Cơ khí">Cơ khí</option>
                       <option value="Điện - Điện lạnh">Điện - Điện lạnh</option>
                       <option value="Kinh tế">Kinh tế</option>
                       <option value="Ngoại ngữ">Ngoại ngữ</option>
                     </select>
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Lớp</label>
                     <input 
                       className="w-full bg-slate-50 p-4 rounded-xl outline-none shadow-inner" 
                       placeholder="..." 
                       value={isAddingUser ? newUser.classCode : editingUser?.classCode || ''} 
                       onChange={e => isAddingUser ? setNewUser({...newUser, classCode: e.target.value}) : setEditingUser({...editingUser!, classCode: e.target.value})} 
                       required 
                     />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Số điện thoại</label>
                   <input 
                     className="w-full bg-slate-50 p-4 rounded-xl outline-none shadow-inner" 
                     placeholder="..." 
                     value={isAddingUser ? newUser.phoneNumber : editingUser?.phoneNumber || ''} 
                     onChange={e => isAddingUser ? setNewUser({...newUser, phoneNumber: e.target.value}) : setEditingUser({...editingUser!, phoneNumber: e.target.value})} 
                     required 
                   />
                 </div>
                 <div className="flex gap-4 mt-8">
                   <button type="submit" className="flex-1 bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                     {isAddingUser ? 'TẠO TÀI KHOẢN' : 'CẬP NHẬT'}
                   </button>
                   <button type="button" onClick={() => { setIsAddingUser(false); setEditingUser(null); }} className="flex-1 bg-slate-100 text-slate-500 font-bold py-5 rounded-2xl">HỦY</button>
                 </div>
               </form>
             </motion.div>
          </div>
        )}

        {/* App Review Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-4xl rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="absolute top-10 right-10 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-slate-400" />
                </button>
                <div className="mb-10">
                   <h3 className="text-3xl font-black italic mb-2">Thẩm định hồ sơ</h3>
                   <div className="flex items-center gap-4 text-slate-500">
                     <span className="font-bold text-slate-900">{selectedApp.userName}</span>
                     <span>•</span>
                     <span className="font-mono text-sm">{selectedApp.userMssv}</span>
                     <span>•</span>
                     <span className="text-xs uppercase font-bold tracking-widest">{new Date(selectedApp.submittedAt).toLocaleDateString()}</span>
                   </div>
                </div>

                 <div className="space-y-8 mb-12 text-left">
                   {selectedApp.criteria.map((parent, i) => (
                      <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                         <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xl font-black">{parent.label}</h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiêu chí {i+1}</span>
                         </div>
                         <div className="space-y-6">
                            {parent.subItems?.filter(s => s.isMet).map((sub, j) => (
                               <div key={j} className="bg-white p-6 rounded-2xl border border-slate-200">
                                  <div className="flex items-center justify-between mb-3">
                                     <p className="font-bold text-slate-900">{sub.label}</p>
                                     <div className="flex gap-1">
                                       <button 
                                         onClick={() => toggleItemStatus(parent.id, sub.id, 'APPROVED')}
                                         className={`p-2 rounded-lg transition-all ${sub.status === 'APPROVED' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}
                                         title="Duyệt mục này"
                                       >
                                         <Check className="h-3 w-3" />
                                       </button>
                                       <button 
                                         onClick={() => toggleItemStatus(parent.id, sub.id, 'MISSING')}
                                         className={`p-2 rounded-lg transition-all ${sub.status === 'MISSING' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}
                                         title="Bị thiếu/Không đạt"
                                       >
                                         <X className="h-3 w-3" />
                                       </button>
                                     </div>
                                  </div>
                                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4">
                                     <span className="text-[10px] font-black text-blue-600 block mb-1 uppercase tracking-widest">Mô tả của sinh viên:</span>
                                     <p className="text-sm text-slate-700 italic">"{sub.evidence}"</p>
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Ghi chú cho mục này (tùy chọn)</label>
                                     <textarea 
                                       className="w-full text-xs bg-slate-50 p-4 rounded-xl outline-none focus:ring-1 focus:ring-blue-300 shadow-inner resize-none"
                                       placeholder="Nhập nhận xét..."
                                       value={sub.feedback || ''}
                                       onChange={(e) => updateSubItemFeedback(parent.id, sub.id, e.target.value)}
                                       rows={2}
                                     />
                                  </div>
                               </div>
                            ))}
                            {parent.subItems?.filter(s => s.isMet).length === 0 && (
                               <div className="text-center py-4 text-slate-400 italic text-sm">Không khai báo mục nào trong tiêu chí này.</div>
                            )}
                         </div>
                      </div>
                   ))}
                 </div>

                 <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] mb-12">
                    <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                       <MessageSquare className="h-5 w-5 text-blue-500" />
                       PHẢN HỒI TỔNG QUÁT CHO SINH VIÊN
                    </h4>
                    <textarea 
                      className="w-full bg-slate-50 p-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-inner font-medium text-slate-700"
                      placeholder="Nhập phản hồi cuối cùng về hồ sơ... (ví dụ: hồ sơ của bạn rất xuất sắc, cần bổ sung thêm minh chứng học tập...)"
                      rows={4}
                      value={adminFeedback}
                      onChange={e => setAdminFeedback(e.target.value)}
                    />
                 </div>

                <div className="grid grid-cols-3 gap-4">
                   <button 
                    onClick={() => handleUpdateStatus(selectedApp.id, 'APPROVED')} 
                    className="bg-emerald-600 text-white font-black py-6 rounded-3xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex flex-col items-center justify-center gap-1"
                   >
                     <CheckCircle className="h-6 w-6" />
                     <span className="text-xs">DUYỆT HỒ SƠ</span>
                   </button>
                   <button 
                    onClick={() => handleUpdateStatus(selectedApp.id, 'SUPPLEMENT_REQUIRED')} 
                    className="bg-blue-600 text-white font-black py-6 rounded-3xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex flex-col items-center justify-center gap-1"
                   >
                     <AlertCircle className="h-6 w-6" />
                     <span className="text-xs uppercase">Y/C BỔ SUNG</span>
                   </button>
                   <button 
                    onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')} 
                    className="bg-white border-2 border-red-100 text-red-500 font-black py-6 rounded-3xl hover:bg-red-50 transition-all flex flex-col items-center justify-center gap-1"
                   >
                     <XCircle className="h-6 w-6" />
                     <span className="text-xs">TỪ CHỐI</span>
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
