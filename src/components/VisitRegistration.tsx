import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Building2, UserCircle, Phone, FileUp, CheckCircle, Send, Clock, AlertCircle } from 'lucide-react';
import { mockVisitService } from '../services/mockDataService';

export const VisitRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    visitTime: '',
    studentCount: 0,
    organization: '',
    leaderName: '',
    leaderPhone: '',
    proposalFileUrl: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      mockVisitService.submitRegistration(formData);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-blue-100 border border-slate-50"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Đăng ký thành công!</h2>
          <p className="text-slate-500 font-medium mb-8">
            Thông tin đăng ký tham quan Không gian truyền thống đã được gửi đi. Ban Tổ chức sẽ liên hệ với bạn qua số điện thoại để xác nhận lịch trình.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg"
          >
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section id="visit-registration" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Content side */}
          <div>
            <div className="inline-block p-4 bg-blue-50 rounded-2xl text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
              Kết nối lịch sử • Tiếp bước truyền thống
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-8 leading-[1.1] uppercase italic tracking-tighter">
              Đăng ký tham quan <br />
              <span className="text-blue-600 underline decoration-red-500/30 underline-offset-8">Không gian Truyền thống</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 max-w-xl">
              Chào mừng các bạn đến với Không gian truyền thống phong trào học sinh, sinh viên Sài Gòn - Gia Định - TP.HCM tại trường Cao đẳng Kỹ thuật Cao Thắng.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-white shadow-xl shadow-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Thời gian mở cửa</h4>
                  <p className="text-sm text-slate-500 font-medium italic">Thứ 2 - Thứ 6 (Sáng: 8h-11h, Chiều: 14h-17h)</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-white shadow-xl shadow-blue-100 rounded-2xl flex items-center justify-center text-red-500 shrink-0 group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Lưu ý đăng ký</h4>
                  <p className="text-sm text-slate-500 font-medium italic">Vui lòng đăng ký trước ít nhất 03 ngày làm việc.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-blue-100 border border-slate-50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    <Calendar className="h-3 w-3" /> Thời gian dự kiến
                  </label>
                  <input 
                    required
                    type="datetime-local" 
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                    value={formData.visitTime}
                    onChange={(e) => setFormData({...formData, visitTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    <Users className="h-3 w-3" /> Số lượng sinh viên
                  </label>
                  <input 
                    required
                    type="number" 
                    placeholder="Nhập số lượng..."
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                    value={formData.studentCount === 0 ? '' : formData.studentCount}
                    onChange={(e) => setFormData({...formData, studentCount: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                  <Building2 className="h-3 w-3" /> Đơn vị / Trường
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="VD: Chi đoàn CCQ2210A / ĐH Bách Khoa"
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    <UserCircle className="h-3 w-3" /> Càn bộ phụ trách
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="Họ tên Trưởng đoàn"
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                    value={formData.leaderName}
                    onChange={(e) => setFormData({...formData, leaderName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                    <Phone className="h-3 w-3" /> Số điện thoại
                  </label>
                  <input 
                    required
                    type="tel" 
                    placeholder="09xx xxx xxx"
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                    value={formData.leaderPhone}
                    onChange={(e) => setFormData({...formData, leaderPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                  <FileUp className="h-3 w-3" /> Công văn đề xuất (Tải lên hoặc dán link)
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Dán link ảnh hoặc mô tả file đính kèm..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm"
                    value={formData.proposalFileUrl}
                    onChange={(e) => setFormData({...formData, proposalFileUrl: e.target.value})}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600">
                    <FileUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 px-2 font-medium italic">
                  Gợi ý: Bạn có thể dán link Google Drive hoặc link ảnh minh chứng công văn có dấu đỏ.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {isLoading ? (
                  <>Đang xử lý...</>
                ) : (
                  <>Gửi yêu cầu đăng ký <Send className="h-4 w-4" /></>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400 font-bold italic">
                * Bằng việc gửi yêu cầu, đơn vị cam kết tuân thủ nội quy tham quan.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
