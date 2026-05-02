import React from 'react';
import { motion } from 'motion/react';
import { SiteSettings } from '../types';
import { Building2, Info, Target, Users } from 'lucide-react';

interface IntroPageProps {
  settings: SiteSettings;
}

export const IntroPage: React.FC<IntroPageProps> = ({ settings }) => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-[1240px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
             <Info className="h-3 w-3" />
             Về chúng tôi
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
            Giới thiệu Hội Sinh Viên
          </h1>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="prose prose-slate max-w-none">
              {settings.introContent?.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
                  {paragraph}
                </p>
              ))}
              {!settings.introContent && (
                <p className="text-slate-400 italic">Nội dung đang được cập nhật...</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mt-12">
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4">
                     <Target className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Sứ mệnh</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Đại diện cho tiếng nói và quyền lợi hợp pháp của sinh viên Cao Thắng.</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center mb-4">
                     <Users className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Giá trị</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Đoàn kết, sáng tạo, xung kích tình nguyện vì cộng đồng.</p>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
              <img 
                src="https://picsum.photos/seed/intro/800/800" 
                alt="Intro placeholder" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
            
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 z-20 hidden md:block">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black">
                     CT
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thành lập từ</div>
                    <div className="text-lg font-black text-slate-900">Năm 1906</div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
