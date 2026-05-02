import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, MessageSquare, Phone, Mail, MapPin, Facebook, Youtube, Github, Award, Heart, BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { NAV_LINKS, STATS, NEWS } from './constants';
import { User, Article, SiteSettings } from './types';
import { mockAuthService, mockAdminService } from './services/mockDataService';
import { Navbar } from './components/Navbar';
import { HeaderBanner } from './components/HeaderBanner';
import { AuthModal } from './components/AuthModal';
import { SV5TSection } from './components/SV5TSection';
import { CertificateLookup } from './components/CertificateLookup';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileModal } from './components/ProfileModal';
import { ArticleDetail } from './components/ArticleDetail';
import { Search, LogIn, Calendar as CalendarIcon, ArrowRight, Play, FileText, Users, Heart as HeartIcon, UserCircle, LogOut } from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(mockAdminService.getSettings());
  const [articles, setArticles] = useState<Article[]>(mockAdminService.getArticles());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [view, setView] = useState<'HOME' | 'ADMIN' | 'SV5T'>('HOME');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavClick = (targetView: 'HOME' | 'SV5T') => {
    setSelectedArticle(null);
    if (targetView === 'SV5T' && currentUser) {
      const isIncomplete = !currentUser.department || !currentUser.classCode;
      if (isIncomplete) {
        setIsProfileModalOpen(true);
        return;
      }
    }
    setView(targetView);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setCurrentUser(mockAuthService.getCurrentUser());
    
    // Refresh settings periodically or on view change might be better, 
    // but for now let's just set it initially and assume admin updates it.
    // Ideally we use a global state or a simple listener pattern.
    setSiteSettings(mockAdminService.getSettings());
    setArticles(mockAdminService.getArticles());

    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const handleLogout = () => {
    mockAuthService.logout();
    setCurrentUser(null);
    setView('HOME');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <HeaderBanner topBannerUrl={siteSettings.topBannerUrl || ''} />
      
      <Navbar 
        view={view}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        currentUser={currentUser}
        selectedArticle={selectedArticle}
        handleNavClick={handleNavClick}
        setView={setView}
      />


      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
          // Auto open profile modal if incomplete
          if (!user.department || !user.classCode) {
            setIsProfileModalOpen(true);
          }
        }} 
      />

      {isProfileModalOpen && currentUser && (
        <ProfileModal 
          user={currentUser} 
          onUpdate={(updated) => {
            setCurrentUser(updated);
            setIsProfileModalOpen(false);
          }} 
        />
      )}

      {view === 'ADMIN' ? (
        <div className="pt-8">
          <AdminDashboard settings={siteSettings} onSettingsUpdate={setSiteSettings} />
        </div>
      ) : view === 'SV5T' ? (
        <SV5TSection user={currentUser} onOpenAuth={() => setIsAuthModalOpen(true)} />
      ) : selectedArticle ? (
        <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />
      ) : (
        <div className="max-w-[1240px] mx-auto px-4 py-12">
          {/* Main Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left/Main Column: News & Features */}
            <div className="lg:col-span-8 space-y-12">
              {articles.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  {/* Category Header */}
                  <div className="bg-[#1e60aa] text-white px-8 py-3 flex items-center justify-between">
                    <span className="font-black text-xs uppercase tracking-widest">Tin tức & Sự kiện tiêu điểm</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  
                  <div className="p-8 md:p-10">
                    {/* Hero Feature Article */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-12 group cursor-pointer"
                      onClick={() => setSelectedArticle(articles[0])}
                    >
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2 overflow-hidden rounded-xl shadow-lg border border-slate-100 aspect-[4/3]">
                          <img 
                            src={articles[0].imageUrl || `https://picsum.photos/seed/${articles[0].id}/800/600`}
                            alt={articles[0].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="md:w-1/2 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-4 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{articles[0].date}</span>
                            <span className="text-slate-300">|</span>
                            <span>{articles[0].category || 'TIN TỨC'}</span>
                          </div>
                          <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                            {articles[0].title}
                          </h2>
                          <p className="text-slate-500 text-sm leading-relaxed line-clamp-4 mb-6 italic">
                            "{articles[0].excerpt || articles[0].content.substring(0, 200) + '...'}"
                          </p>
                          <button className="text-[#1e60aa] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                            CHI TIẾT <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Secondary News Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                      {articles.slice(1, 3).map((item) => (
                        <div 
                          key={item.id} 
                          className="group cursor-pointer flex flex-col gap-4"
                          onClick={() => setSelectedArticle(item)}
                        >
                          <div className="aspect-video rounded-xl overflow-hidden shadow border border-slate-100">
                            <img 
                              src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/250`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.date}</p>
                            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors uppercase">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Feed Block */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 px-4">Thông báo mới nhất</h3>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.slice(1).map((item, i) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedArticle(item)}
                      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                    >
                      <div className="flex gap-5">
                        <div className="w-20 h-20 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                          <img 
                            src={item.imageUrl || `https://picsum.photos/seed/${item.id+5}/200/200`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">{item.date}</p>
                          <h4 className="text-xs font-bold text-slate-700 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                            {item.title.toUpperCase()}
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Account Widget */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-16 translate-x-16 -z-0"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  {!currentUser ? (
                    <>
                      <div className="bg-[#1e60aa] text-white p-5 rounded-2xl shadow-xl shadow-blue-100 mb-6 group-hover:scale-110 transition-transform">
                        <UserCircle className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">CỔNG THÔNG TIN</h3>
                      <p className="text-xs text-slate-500 mb-8 font-medium">Vui lòng đăng nhập để sử dụng các tiện ích sinh viên.</p>
                      <button 
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full bg-[#1e60aa] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:shadow-xl active:scale-95"
                      >
                        Đăng nhập ngay
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-blue-100 flex items-center justify-center text-[#1e60aa] mb-4 overflow-hidden">
                        <UserCircle className="h-12 w-12" />
                      </div>
                      <h3 className="text-sm font-black text-slate-900 leading-tight uppercase mb-1">{currentUser.fullName}</h3>
                      <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest">{currentUser.mssv}</p>
                      
                      <div className="grid grid-cols-1 gap-3 w-full">
                        <button 
                          onClick={() => setIsProfileModalOpen(true)}
                          className="w-full bg-slate-50 hover:bg-blue-50 hover:text-blue-600 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-slate-100"
                        >
                          Hồ sơ cá nhân
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-red-100"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Statistics Small Modern */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Users className="h-24 w-24" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Thống kê hệ thống</h4>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trực tuyến</p>
                      <p className="text-2xl font-black">256</p>
                    </div>
                    <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center">
                       <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-px bg-white/10 w-full"></div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Tuần qua</p>
                        <p className="text-sm font-black">12.4K</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Tổng cộng</p>
                        <p className="text-sm font-black">5.4M</p>
                     </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white overflow-hidden">
                  {siteSettings.logoUrl ? (
                    <img src={siteSettings.logoUrl} className="w-full h-full object-contain p-1 bg-white" />
                  ) : (
                    <span className="text-xl font-bold italic">CT</span>
                  )}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-extrabold tracking-tight">Hội Sinh Viên</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">CKT Cao Thắng</span>
                </div>
              </div>
              <p className="text-slate-500 max-w-md leading-relaxed mx-auto md:mx-0">
                Đây là website chính thức của Hội Sinh viên Cao Thắng. 
                Cập nhật nhanh nhất các thông tin hoạt động, phong trào và quyền lợi của sinh viên.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Liên kết nhanh</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><button onClick={() => handleNavClick('HOME')} className="hover:text-blue-600 transition-colors">Trang chủ</button></li>
                <li><button onClick={() => handleNavClick('SV5T')} className="hover:text-blue-600 transition-colors">Sinh viên 5 Tốt</button></li>
                <li><a href="#activities" className="hover:text-blue-600 transition-colors">Hoạt động</a></li>
                <li><a href="#certificates" className="hover:text-blue-600 transition-colors">Tra cứu GCN</a></li>
                <li><a href="#news" className="hover:text-blue-600 transition-colors">Tin tức</a></li>
                <li><a href="#contact" className="hover:text-blue-600 transition-colors">Liên hệ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Pháp lý</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Bản quyền</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-sm">
              © 2026 Hội Sinh viên Cao Thắng. Designed with passion.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Youtube className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Github className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
