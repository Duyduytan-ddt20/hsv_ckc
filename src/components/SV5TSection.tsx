import React, { useState, useEffect } from 'react';
import { User, SV5TCriteria, CriterionConfig, CriterionItem } from '../types';
import { mockSV5TService } from '../services/mockDataService';
import { CheckCircle2, AlertCircle, Send, Info, Award, MessageSquare, Check, X, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface SV5TSectionProps {
  user: User | null;
  onOpenAuth: () => void;
}

export const SV5TSection: React.FC<SV5TSectionProps> = ({ user, onOpenAuth }) => {
  const [existingApp, setExistingApp] = useState<SV5TCriteria | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [criteriaState, setCriteriaState] = useState<CriterionItem[]>([]);

  useEffect(() => {
    const freshConfig = mockSV5TService.getConfig();
    const initialState = freshConfig.map(c => ({
      id: c.id,
      label: c.label,
      description: c.description,
      isMet: false,
      evidence: '',
      subItems: c.subItems?.map(s => ({
        id: s.id,
        label: s.label,
        description: s.description,
        isMet: false,
        evidence: ''
      }))
    }));
    setCriteriaState(initialState);

    if (user) {
      const app = mockSV5TService.getUserApplication(user.uid);
      setExistingApp(app);
      if (app) {
        setCriteriaState(app.criteria);
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      const newApp = mockSV5TService.submitApplication(user, criteriaState);
      setExistingApp(newApp);
      setIsSubmitting(false);
    }, 1000);
  };

  const toggleSubItem = (parentId: string, subId: string) => {
    setCriteriaState(prev => prev.map(parent => {
      if (parent.id === parentId && parent.subItems) {
        const newSubItems = parent.subItems.map(sub => 
          sub.id === subId ? { ...sub, isMet: !sub.isMet } : sub
        );
        // If at least one sub-item is met, mark parent as potentially met (or just keep it structural)
        return { ...parent, subItems: newSubItems };
      }
      return parent;
    }));
  };

  const updateSubEvidence = (parentId: string, subId: string, text: string) => {
    setCriteriaState(prev => prev.map(parent => {
      if (parent.id === parentId && parent.subItems) {
        const newSubItems = parent.subItems.map(sub => 
          sub.id === subId ? { ...sub, evidence: text } : sub
        );
        return { ...parent, subItems: newSubItems };
      }
      return parent;
    }));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12">
           <h1 className="text-4xl font-black text-slate-900 mb-4">Hồ sơ Sinh viên 5 Tốt</h1>
           <p className="text-slate-500">Khai báo thành tích và nộp minh chứng cho kỳ xét chọn năm học 2025 - 2026</p>
        </div>

        {!user ? (
          <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center border border-slate-100">
            <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <AlertCircle className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Bạn chưa đăng nhập</h3>
            <p className="text-slate-500 mb-8">Vui lòng đăng nhập bằng tài khoản sinh viên để bắt đầu nộp hồ sơ.</p>
            <button 
              onClick={onOpenAuth}
              className="bg-blue-600 text-white font-bold px-10 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
            >
              Đăng nhập ngay
            </button>
          </div>
        ) : existingApp && existingApp.status !== 'REJECTED' && existingApp.status !== 'SUPPLEMENT_REQUIRED' ? (
          <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center border border-slate-100">
            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
               <Award className="h-12 w-12" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">Hồ sơ đã được gửi!</h3>
            <div className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-bold uppercase tracking-widest mt-4">
              {existingApp.status === 'PENDING' ? 'ĐANG CHỜ XÉT DUYỆT' : 'ĐÃ ĐƯỢC CÔNG NHẬN'}
            </div>
            
            {existingApp.adminFeedback && (
              <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl text-left">
                <h4 className="flex items-center gap-2 text-amber-800 font-bold mb-2">
                  <MessageSquare className="h-5 w-5" />
                  Phản hồi từ Ban chuyên môn:
                </h4>
                <p className="text-amber-700 text-sm whitespace-pre-wrap">{existingApp.adminFeedback}</p>
              </div>
            )}

            <div className="mt-12 space-y-4 text-left">
              <h4 className="font-bold text-slate-900 border-b pb-2 mb-4">Chi tiết minh chứng đã gửi:</h4>
              {existingApp.criteria.map(parent => (
                <div key={parent.id} className="space-y-4">
                   {parent.subItems?.filter(s => s.isMet).map(sub => (
                     <div key={sub.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                           <span className="font-bold text-slate-800">{sub.label}</span>
                            <div className="flex items-center gap-2">
                              {sub.status === 'APPROVED' && <span className="flex items-center gap-1 text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase"><Check className="h-2.1 w-2.1" /> Đạt</span>}
                              {sub.status === 'MISSING' && <span className="flex items-center gap-1 text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black uppercase"><X className="h-2.1 w-2.1" /> Thiếu</span>}
                              {!sub.status && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase">Đã nộp</span>}
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{sub.evidence}</p>
                        {sub.feedback && (
                          <div className="p-3 bg-blue-50 rounded-xl text-blue-700 text-xs italic">
                            <span className="font-bold not-italic mr-1">Nhận xét:</span>
                            {sub.feedback}
                          </div>
                        )}
                     </div>
                   ))}
                </div>
              ))}
            </div>

            <p className="text-slate-400 mt-12 text-sm">
              Hệ thống đã ghi nhận hồ sơ của <strong>{user.fullName}</strong>. 
              Bạn có thể theo dõi kết quả tại trang này hoặc qua email sinh viên.
            </p>
            <button 
              onClick={() => setExistingApp(null)}
              className="mt-12 text-blue-600 font-bold hover:underline"
            >
              Cập nhật lại hồ sơ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            {existingApp?.status === 'SUPPLEMENT_REQUIRED' && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 flex flex-col md:flex-row items-center gap-6"
              >
                <div className="bg-white/20 p-4 rounded-3xl shrink-0">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">YÊU CẦU BỔ SUNG MINH CHỨNG</h3>
                  <p className="text-blue-50 text-sm leading-relaxed opacity-90">
                    Ban chuyên môn đã xem xét hồ sơ của bạn và yêu cầu bổ sung thêm thông tin. 
                    Vui lòng xem các mục có đánh dấu <b>"Thiếu minh chứng"</b> bên dưới để cập nhật lại.
                  </p>
                  {existingApp.adminFeedback && (
                    <div className="mt-4 p-4 bg-white/10 rounded-2xl border border-white/20 italic">
                      "{existingApp.adminFeedback}"
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {criteriaState.map((parent) => (
              <div key={parent.id} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 italic-relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                     {parent.label.charAt(0)}
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-slate-900">{parent.label}</h2>
                     <p className="text-sm text-slate-500">{parent.description}</p>
                   </div>
                </div>

                <div className="space-y-8">
                  {parent.subItems?.map((sub) => (
                    <div key={sub.id} className="space-y-4">
                      <label className="flex items-start gap-4 cursor-pointer p-6 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all border border-slate-100">
                         <input 
                           type="checkbox" 
                           className="mt-1 w-6 h-6 rounded-lg text-blue-600 border-slate-300 focus:ring-blue-500"
                           checked={sub.isMet}
                           onChange={() => toggleSubItem(parent.id, sub.id)}
                         />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-800 block text-lg">{sub.label}</span>
                              {existingApp?.status === 'SUPPLEMENT_REQUIRED' && sub.status === 'MISSING' && (
                                <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-widest animate-pulse border border-amber-200">
                                  <X className="h-2.5 w-2.5" /> Thiếu minh chứng
                                </span>
                              )}
                              {existingApp?.status === 'SUPPLEMENT_REQUIRED' && sub.status === 'APPROVED' && (
                                <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-widest border border-emerald-200">
                                  <Check className="h-2.5 w-2.5" /> Đã duyệt
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-slate-500">{sub.description}</span>
                          </div>
                      </label>

                      {sub.isMet && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="pl-14"
                        >
                          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-3">
                             <label className="text-xs font-bold text-blue-600 uppercase tracking-widest">Minh chứng thành tích</label>
                             <textarea 
                               className="w-full bg-white border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                               placeholder="VD: Link ảnh giấy khen, mô tả quá trình đạt được..."
                               rows={3}
                               value={sub.evidence}
                               onChange={(e) => updateSubEvidence(parent.id, sub.id, e.target.value)}
                               required
                             />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end p-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-3 bg-blue-600 text-white font-black px-12 py-5 rounded-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all ${isSubmitting ? 'opacity-70' : ''}`}
              >
                {isSubmitting ? 'ĐANG XỬ LÝ...' : 'NỘP HỒ SƠ XÉT CHỌN'}
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
