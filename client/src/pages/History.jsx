import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, ExternalLink, Calendar, Search, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.history || []);
    } catch (err) {
      // Error fetching history
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <div className="space-y-1">
        <h2 className="text-2xl font-black">Retrieving History</h2>
        <p className="text-gray-500 font-medium">Fetching your past architectural requests...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Clock size={24} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Activity Log</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Project <span className="text-primary">History</span></h1>
          <p className="text-gray-500 font-medium">Review and re-access your previous dependency recommendations.</p>
        </div>
        
        {history.length > 0 && (
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4 border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">{history.length} Requests Total</span>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 glass rounded-[3rem] border-2 border-dashed border-white/5 space-y-8"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
            <Search size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-400">No requests found yet</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">Start exploring dependencies and they'll appear here for quick access later.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-10 py-4 bg-primary rounded-2xl font-black hover:scale-[1.02] transition-smooth shadow-2xl shadow-primary/20"
          >
            Start New Project
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {history.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={index} 
              className="glass p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-primary/50 hover:bg-white/3 transition-smooth group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-smooth"></div>
              
              <div className="space-y-4 relative z-10 grow">
                <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  <div className="p-1.5 bg-white/5 rounded-lg">
                    <Calendar size={14} className="text-primary" />
                  </div>
                  {formatDate(item.createdAt)}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black group-hover:text-primary transition-smooth">{item.feature}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Kotlin</span>
                      <span className="text-sm font-bold text-gray-300">{item.config?.kotlinVersion || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Gradle</span>
                      <span className="text-sm font-bold text-gray-300">{item.config?.gradleVersion || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">UI Framework</span>
                      <span className="text-sm font-bold text-primary">{item.config?.uiType || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Min SDK</span>
                      <span className="text-sm font-bold text-gray-300">{item.config?.minSdk || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/results', { state: { formData: { ...item.config, feature: item.feature }, requestId: item._id } })}
                className="flex items-center gap-3 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl transition-smooth text-sm font-black group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-2xl group-hover:shadow-primary/20 relative z-10 group-hover:-translate-x-2 whitespace-nowrap"
              >
                Restore Results <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="flex justify-center pt-10">
          <div className="glass px-8 py-4 rounded-2xl flex items-center gap-4 border-primary/20">
            <Sparkles size={18} className="text-primary" />
            <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Premium History Storage Enabled</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
