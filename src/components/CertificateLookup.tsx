import React, { useState } from 'react';
import { Search, Download, Award, Calendar, Clock, User as UserIcon } from 'lucide-react';
import { mockCertificateService } from '../services/mockDataService';
import { VolunteerCertificate } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const CertificateLookup: React.FC = () => {
  const [mssv, setMssv] = useState('');
  const [results, setResults] = useState<VolunteerCertificate[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mssv) return;
    const found = mockCertificateService.lookupByMSSV(mssv);
    setResults(found);
    setHasSearched(true);
  };

  return (
    <section id="certificates" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Tra cứu Giấy chứng nhận</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Nhập Mã số sinh viên của bạn để tìm kiếm và tải về các giấy chứng nhận hoạt động tình nguyện đã tham gia.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Nhập MSSV (ví dụ: 22000001)"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={mssv}
                onChange={(e) => setMssv(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Tra cứu
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {results.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Award className="h-24 w-24 text-blue-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
                    <Award className="h-5 w-5" />
                    <span>GIẤY CHỨNG NHẬN</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{cert.eventName}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <UserIcon className="h-4 w-4" />
                      <span>{cert.studentName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{cert.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{cert.hours} giờ CTXH</span>
                    </div>
                  </div>
                  <button className="mt-8 flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                    Tải về PDF <Download className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasSearched && results.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-slate-500"
          >
            Không tìm thấy dữ liệu cho MSSV này. Vui lòng kiểm tra lại.
          </motion.div>
        )}
      </div>
    </section>
  );
};
