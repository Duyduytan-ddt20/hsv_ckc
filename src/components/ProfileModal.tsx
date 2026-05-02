import React, { useState } from 'react';
import { UserCircle, Building2, Hash, Save, AlertTriangle, Phone, Mail, Camera, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';
import { mockAuthService } from '../services/mockDataService';

interface ProfileModalProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onUpdate }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [mssv, setMssv] = useState(user.mssv);
  const [department, setDepartment] = useState(user.department || '');
  const [classCode, setClassCode] = useState(user.classCode || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert('Kích thước ảnh quá lớn! Vui lòng chọn ảnh dưới 1.5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      const updatedUser: User = {
        ...user,
        fullName,
        mssv,
        department,
        classCode,
        phoneNumber,
        avatar
      };
      mockAuthService.updateUser(updatedUser);
      onUpdate(updatedUser);
      setIsSaving(false);
      alert('Đã cập nhật hồ sơ thành công!');
    }, 800);
  };

  const isProfileIncomplete = !user.department || !user.classCode || !user.phoneNumber;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <UserCircle className="h-32 w-32 text-blue-900" />
        </div>

        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
          {isProfileIncomplete && (
            <div className="mb-6 p-4 bg-amber-50 rounded-2xl flex items-start gap-3 border border-amber-100">
               <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
               <div>
                  <h4 className="text-sm font-bold text-amber-800">Thông tin chưa đầy đủ</h4>
                  <p className="text-xs text-amber-700">Vui lòng hoàn thiện SĐT, Khoa và Lớp để có thể tham gia xét chọn Sinh viên 5 Tốt.</p>
               </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="relative group mx-auto md:mx-0">
               <div className="w-32 h-32 rounded-3xl bg-slate-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-12 w-12 text-slate-200" />
                  )}
               </div>
               <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all">
                  <Camera className="h-4 w-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
               </label>
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Hồ sơ sinh viên</h2>
              <p className="text-slate-500 font-medium">Bản tin học viên Cao Thắng</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                 <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                 <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{user.email}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <UserCircle className="h-3 w-3" /> Họ và tên
                </label>
                <input 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 shadow-inner focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Hash className="h-3 w-3" /> MSSV
                </label>
                <input 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 shadow-inner focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={mssv}
                  onChange={(e) => setMssv(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  Lớp sinh hoạt
                </label>
                <input 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 shadow-inner focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="VD: CCQ2210..."
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Phone className="h-3 w-3" /> Số điện thoại
                </label>
                <input 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 shadow-inner focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0xxxxxxxxx"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Building2 className="h-3 w-3" /> Khoa / Bộ môn
              </label>
              <select 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 shadow-inner focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="" disabled>Chọn khoa...</option>
                <option value="Cơ khí">Khoa Cơ khí</option>
                <option value="Công nghệ Thông tin">Khoa Công nghệ Thông tin</option>
                <option value="Điện - Điện lạnh">Khoa Điện - Điện lạnh</option>
                <option value="Điện tử - Truyền thông">Khoa Điện tử - Truyền thông</option>
                <option value="Kinh tế">Khoa Kinh tế</option>
                <option value="Công nghệ Ô tô">Khoa Công nghệ Ô tô</option>
                <option value="Nhiệt lạnh">Bộ môn Nhiệt lạnh</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
               <button 
                type="submit"
                disabled={isSaving}
                className={`flex-1 bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${isSaving ? 'opacity-70' : ''}`}
              >
                {isSaving ? 'ĐANG LƯU...' : 'LƯU HỒ SƠ'}
                {!isSaving && <Save className="h-5 w-5" />}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
