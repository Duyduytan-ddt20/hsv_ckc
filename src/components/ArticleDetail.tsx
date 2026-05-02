import React from 'react';
import { Article } from '../types';
import { Eye, Calendar, User, ArrowLeft, Share2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen"
    >
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <img 
          src={article.imageUrl || `https://picsum.photos/seed/${article.id}/1200/600`} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-10 left-0 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <button 
              onClick={onBack}
              className="mb-6 flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Quay lại
            </button>
            <div className="flex gap-3 mb-4">
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {article.category || 'TIN TỨC'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter max-w-4xl">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-slate-100 mb-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                {article.date}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Ban chuyên môn
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                {article.views} lượt xem
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-medium whitespace-pre-wrap mb-12">
              {article.content}
            </div>

            {/* Gallery */}
            {article.gallery && article.gallery.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                  Hình ảnh đính kèm
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {article.gallery.map((img, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer"
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-4 text-slate-400">
                <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Chia sẻ</span>
                </button>
                <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Bình luận</span>
                </button>
              </div>
              <button 
                onClick={onBack}
                className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-bold transition-all"
              >
                Trở về trang chủ
              </button>
            </div>
          </div>

          {/* Sidebar (Optional info or related articles) */}
          <div className="lg:w-80 space-y-8">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h3 className="text-lg font-black mb-6 uppercase tracking-tight">Thông tin bài viết</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Mã bài viết</p>
                   <p className="font-mono text-sm font-bold">CT-{article.id.toUpperCase()}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tác giả</p>
                   <p className="font-bold text-slate-900">Ban Kiểm tra Hội Sinh Viên</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100">
               <h3 className="text-lg font-black mb-4 uppercase leading-tight">Góp ý cho bài viết</h3>
               <p className="text-blue-100 text-sm mb-6">Mọi thắc mắc hoặc ý kiến đóng góp về nội dung bài viết, vui lòng liên hệ Ban chuyên môn.</p>
               <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">GỬI YÊU CẦU</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
