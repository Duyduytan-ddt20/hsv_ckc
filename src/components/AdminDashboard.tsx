import React, { useState, useEffect } from 'react';
import { User, SV5TCriteria, CriterionConfig, CriterionItem, Article, SiteSettings } from '../types';
import { mockSV5TService, mockAuthService, mockAdminService } from '../services/mockDataService';
import { Users, FileText, CheckCircle, Clock, XCircle, Settings, BarChart3, ChevronRight, Check, X, MessageSquare, Plus, Trash2, Edit3, Image as ImageIcon, Layout, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type AdminTab = 'OVERVIEW' | 'APPLICATIONS' | 'ARTICLES' | 'USER_MANAGEMENT' | 'SITE_SETTINGS' | 'CRITERIA';

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
  
  const [selectedApp, setSelectedApp] = useState<SV5TCriteria | null>(null);
  const [adminFeedback, setAdminFeedback] = useState('');
  
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
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

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    mockAuthService.register({ ...newUser });
    setAllUsers(mockAuthService.getUsers());
    setIsAddingUser(false);
    setNewUser({ fullName: '', email: '', mssv: '', department: '', classCode: '', phoneNumber: '' });
    alert('Đã tạo tài khoản thành công!');
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
            <SidebarItem tab="OVERVIEW" icon={BarChart3} label="Tổng quan" />
            <SidebarItem tab="APPLICATIONS" icon={FileText} label="Hồ sơ SV 5 Tốt" />
            <SidebarItem tab="ARTICLES" icon={MessageSquare} label="Bài viết & Tin tức" />
            <SidebarItem tab="USER_MANAGEMENT" icon={Users} label="Quản lý tài khoản" />
            <SidebarItem tab="SITE_SETTINGS" icon={Layout} label="Giao diện" />
            <SidebarItem tab="CRITERIA" icon={Settings} label="Cấu hình tiêu chí" />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'OVERVIEW' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-3xl font-black mb-8 text-slate-900 uppercase tracking-tighter">⚡ Thống kê hệ thống</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {[
                    { label: 'Tổng sinh viên', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Hồ sơ đã nộp', value: stats.totalApps, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Chờ xét duyệt', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Bổ sung', value: stats.supplement, icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                       <div className={`${item.bg} ${item.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                         <item.icon className="h-5 w-5" />
                       </div>
                       <div className="text-2xl font-black text-slate-900">{item.value}</div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-[350px]">
                    <h3 className="text-lg font-bold mb-4">Trạng thái hồ sơ</h3>
                    <div className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={stats.byStatus} 
                            dataKey="value" 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={50} 
                            outerRadius={80}
                            paddingAngle={5}
                          >
                            <Cell fill="#fbbf24" /><Cell fill="#10b981" /><Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-[350px]">
                    <h3 className="text-lg font-bold mb-4">Theo tiêu chí</h3>
                    <div className="h-full pb-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.criteriaBreakdown}>
                          <XAxis dataKey="name" fontSize={9} />
                          <YAxis fontSize={9} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8b5cf6" radius={[5, 5, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
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
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredUsers.length === 0 ? (
                          <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium font-bold italic">Không tìm thấy tài khoản nào phù hợp.</td></tr>
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
                               <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                 user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                               }`}>
                                 {user.role}
                               </span>
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
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">🎨 Cài đặt giao diện</h2>
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
                      <p className="text-[10px] text-slate-400 px-1 mb-4 italic">* Lưu ý: Ưu tiên sử dụng ảnh ngang (tỷ lệ ~4:1) để hiển thị đẹp nhất.</p>
                      
                      <div className="flex gap-4">
                        <div className="relative flex-1 group">
                          <input 
                            className="w-full bg-slate-50 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm font-medium truncate"
                            value={localSettings.topBannerUrl || ''}
                            onChange={e => setLocalSettings(prev => ({ ...prev, topBannerUrl: e.target.value }))}
                            placeholder="Dán URL ảnh hoặc tải lên..."
                          />
                          {localSettings.topBannerUrl && (
                            <button 
                              onClick={() => setLocalSettings(prev => ({ ...prev, topBannerUrl: '' }))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        <label className="bg-blue-50 text-blue-600 px-6 rounded-2xl cursor-pointer hover:bg-blue-100 transition-all flex items-center justify-center border border-blue-100 group">
                          <ImageIcon className="h-5 w-5 md:mr-2 group-hover:scale-110 transition-transform" />
                          <span className="hidden md:inline font-bold text-xs uppercase tracking-widest">Tải ảnh lên</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'topBannerUrl')} />
                        </label>
                      </div>
                    </div>

                    {localSettings.topBannerUrl ? (
                      <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100 aspect-[1240/300] md:aspect-[1240/250]">
                         <img 
                          src={localSettings.topBannerUrl} 
                          className="w-full h-full object-cover" 
                          onError={(e) => (e.currentTarget.src = "https://placehold.co/1200x300?text=Link+anh+bi+loi")}
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-600 shadow-sm">
                           Xem trước thực tế
                         </div>
                      </div>
                    ) : (
                      <div className="rounded-[2rem] border-2 border-dashed border-slate-200 aspect-[1240/250] flex flex-col items-center justify-center text-slate-300 gap-2 bg-slate-50/50">
                        <ImageIcon className="h-12 w-12 opacity-20" />
                        <p className="font-bold text-xs uppercase tracking-widest">Chưa có ảnh banner</p>
                      </div>
                    )}
                  </div>

                  {/* Logo Section */}
                  <div className="pt-8 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1 space-y-4 w-full">
                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Logo Hệ thống / Văn bản đại diện</label>
                        <div className="flex gap-4">
                          <input 
                            className="flex-1 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-sm font-medium"
                            value={localSettings.logoUrl || ''}
                            onChange={e => setLocalSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                            placeholder="URL logo..."
                          />
                          <label className="bg-slate-100 p-4 rounded-2xl cursor-pointer hover:bg-slate-200 transition-colors flex items-center justify-center border border-slate-200">
                             <ImageIcon className="h-5 w-5 text-slate-600" />
                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                          </label>
                        </div>
                      </div>

                      <div className="shrink-0 w-32 h-32 bg-slate-50 rounded-[2rem] border-2 border-white shadow-lg flex items-center justify-center p-4">
                        {localSettings.logoUrl ? (
                          <img src={localSettings.logoUrl} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="h-6 w-6 text-slate-200 mx-auto" />
                            <p className="text-[8px] font-bold text-slate-300 uppercase mt-2">No Logo</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center">
                    <button 
                      onClick={handleSaveSettings}
                      className="w-full md:w-auto bg-blue-600 text-white font-black px-16 py-5 rounded-3xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                    >
                      CẬP NHẬT GIAO DIỆN NGAY
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
        {isAddingUser && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative">
               <button 
                 onClick={() => setIsAddingUser(false)}
                 className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors"
               >
                 <X className="h-6 w-6 text-slate-400" />
               </button>
               <h3 className="text-2xl font-black mb-8 italic">Tạo tài khoản mới</h3>
               <form onSubmit={handleCreateUser} className="space-y-4 text-left">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Họ và tên</label>
                     <input className="w-full bg-slate-50 p-4 rounded-xl outline-none font-bold shadow-inner" placeholder="..." value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} required />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase px-1">MSSV</label>
                     <input className="w-full bg-slate-50 p-4 rounded-xl outline-none font-bold shadow-inner" placeholder="..." value={newUser.mssv} onChange={e => setNewUser({...newUser, mssv: e.target.value})} required />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Email</label>
                   <input className="w-full bg-slate-50 p-4 rounded-xl outline-none shadow-inner" placeholder="email@example.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Lớp</label>
                     <input className="w-full bg-slate-50 p-4 rounded-xl outline-none shadow-inner" placeholder="..." value={newUser.classCode} onChange={e => setNewUser({...newUser, classCode: e.target.value})} required />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Số điện thoại</label>
                     <input className="w-full bg-slate-50 p-4 rounded-xl outline-none shadow-inner" placeholder="..." value={newUser.phoneNumber} onChange={e => setNewUser({...newUser, phoneNumber: e.target.value})} required />
                   </div>
                 </div>
                 <div className="flex gap-4 mt-8">
                   <button type="submit" className="flex-1 bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">TẠO TÀI KHOẢN</button>
                   <button type="button" onClick={() => setIsAddingUser(false)} className="flex-1 bg-slate-100 text-slate-500 font-bold py-5 rounded-2xl">HỦY</button>
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
