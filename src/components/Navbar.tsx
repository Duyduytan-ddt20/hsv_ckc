import React from 'react';
import { NavLink } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Play, Calendar as CalendarIcon, LogOut } from 'lucide-react';

interface NavbarProps {
  view: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  currentUser: any;
  selectedArticle: any;
  handleNavClick: (id: any) => void;
  setView: (view: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  view,
  isMenuOpen,
  setIsMenuOpen,
  currentUser,
  selectedArticle,
  handleNavClick,
  setView,
  onLogout,
}) => {
  const navItems = [
    { id: 'HOME', label: 'Trang chủ' },
    { id: 'INTRO', label: 'Giới thiệu' },
    { id: 'SV5T', label: 'Sinh viên 5 tốt' },
    { id: 'NEWS', label: 'Tin tức' },
    { id: 'CERTIFICATES', label: 'Tra cứu GCN' },
    { id: 'CONTACT', label: 'Liên hệ' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-slate-100 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center h-full gap-1">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleNavClick(item.id as any)}
              className={`px-4 h-full flex items-center text-[10px] font-black uppercase tracking-widest transition-all relative group ${
                (view === item.id || (item.id === 'HOME' && view === 'HOME' && !selectedArticle)) 
                  ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'
              }`}
            >
              {item.label}
              {(view === item.id || (item.id === 'HOME' && view === 'HOME' && !selectedArticle)) && (
                <motion.div layoutId="nav-underline" className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2 mr-2">
             <CalendarIcon className="h-3 w-3 text-blue-500" />
             {new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })}
          </div>
          
          <div className="w-px h-6 bg-slate-100 hidden lg:block"></div>

          {currentUser?.role === 'ADMIN' && (
            <button 
              onClick={() => setView(view === 'HOME' ? 'ADMIN' : 'HOME')}
              className="bg-slate-900 text-white px-3 md:px-4 h-8 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 group"
            >
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full group-hover:animate-ping"></div>
              <span className="hidden sm:inline">{view === 'ADMIN' ? 'TRANG CHỦ' : 'QUẢN TRỊ'}</span>
              <span className="sm:hidden">{view === 'ADMIN' ? 'HOME' : 'AD'}</span>
            </button>
          )}

          {currentUser && (
            <button 
              onClick={onLogout}
              className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all border border-slate-100"
              title="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'HOME' || item.id === 'SV5T') handleNavClick(item.id as any);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    view === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
