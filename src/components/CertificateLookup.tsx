import React, { useState } from 'react';
import { Search, Download, Award, Calendar, Eye, User as UserIcon } from 'lucide-react';
import { mockCertificateService } from '../services/mockDataService';
import { CertificateImage } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const CertificateLookup: React.FC = () => {
  const [name, setName] = useState('');
  const [results, setResults] = useState<CertificateImage[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const found = mockCertificateService.searchByName(name);
    setResults(found);
    setHasSearched(true);
  };

  return (
    <section id="certificates" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-white rounded-3xl shadow-xl shadow-blue-100 mb-6 font-black text-blue-600 uppercase tracking-widest text-[10px]">
            Hệ thống tra cứu trực tuyến
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">🏆 Tra cứu Giấy chứng nhận</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium italic">
            Nhập "Họ tên đầy đủ" (có dấu) của bạn để tìm kiếm các bản điện tử giấy chứng nhận các hoạt động.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Nhập họ tên sinh viên (VD: Nguyễn Văn Anh)"
                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all shadow-xl shadow-blue-50/50 font-bold text-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button className="bg-slate-900 text-white font-black px-10 py-5 rounded-[2rem] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              <Search className="h-4 w-4" /> Bắt đầu Tìm kiếm
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {results.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl shadow-blue-100/20 hover:shadow-2xl hover:-translate-y-2 transition-all p-4"
              >
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative mb-6">
                  <img 
                    src={cert.imageUrl} 
                    alt={cert.studentName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="p-4 bg-white rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all">
                       <Eye className="h-6 w-6" />
                    </button>
                    <a 
                      href={cert.imageUrl} 
                      download={`${cert.studentName}_Certificate.jpg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                       <Download className="h-6 w-6" />
                    </a>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-[0.2em] mb-2">
                    <Award className="h-4 w-4" />
                    <span>Chứng nhận chính thức</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-4 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight italic">
                    {cert.studentName}
                  </h3>
                  
                  <div className="flex items-center justify-between text-slate-400 font-bold text-[10px] bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 uppercase tracking-widest">
                       <Calendar className="h-3.5 w-3.5" />
                       {cert.issueDate}
                    </div>
                    <div className="flex items-center gap-2 uppercase tracking-widest">
                       ID: {cert.id.slice(0, 5).toUpperCase()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasSearched && results.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-inner"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <Search className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase">Không tìm thấy chứng nhận</h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2 italic text-sm">
              Vui lòng kiểm tra lại họ tên (đủ dấu, đúng chính tả) hoặc liên hệ BTC để được giải đáp.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
