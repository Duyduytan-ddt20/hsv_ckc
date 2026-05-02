import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Article } from '../types';
import { Search, Calendar, ChevronRight, MessageSquare, Newspaper, Tag } from 'lucide-react';

interface NewsPageProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ articles, onArticleClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-6">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                 <Newspaper className="h-3 w-3" />
                 Tin tức mới nhất
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Bản tin học viên</h1>
            </div>

            <div className="relative group">
              <input 
                type="text" 
                placeholder="Tìm kiếm bài viết..." 
                className="bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 pl-14 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 w-full md:w-80 transition-all font-medium shadow-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main List */}
          <div className="lg:col-span-3 space-y-8">
            {filteredArticles.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-slate-100">
                 <Search className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                 <p className="text-slate-500 font-bold">Không tìm thấy bài viết nào phù hợp.</p>
              </div>
            ) : filteredArticles.map((article, i) => (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 flex flex-col md:flex-row group"
              >
                <div className="md:w-72 lg:w-80 h-64 md:h-auto overflow-hidden shrink-0">
                  <img 
                    src={article.imageUrl || `https://picsum.photos/seed/${article.id}/800/600`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={article.title}
                  />
                </div>
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {article.category && (
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                          {article.category}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 uppercase">
                         <Calendar className="h-3 w-3" /> {article.date}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                      {article.excerpt || article.content.substring(0, 150) + '...'}
                    </p>
                  </div>
                  <button 
                    onClick={() => onArticleClick(article)}
                    className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-widest group/btn"
                  >
                    Đọc tiếp 
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover/btn:bg-blue-600 transition-all group-hover/btn:translate-x-1">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Categories */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Tag className="h-4 w-4 text-blue-600" /> Chuyên mục
               </h4>
               <div className="flex flex-wrap gap-2">
                 {categories.map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setSearchQuery(cat || '')}
                    className="px-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl text-[10px] font-bold uppercase transition-all"
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>

            {/* Support Box */}
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <MessageSquare className="h-10 w-10 text-blue-500 mb-4" />
                  <h4 className="text-lg font-black text-white mb-2 leading-tight">Bạn có tin tức muốn chia sẻ?</h4>
                  <p className="text-slate-400 text-xs mb-6 leading-relaxed">Hãy liên hệ với ban biên tập để gửi bài viết hoặc phản ánh ý kiến.</p>
                  <button className="w-full bg-blue-600 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all">Gửi thông tin</button>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
