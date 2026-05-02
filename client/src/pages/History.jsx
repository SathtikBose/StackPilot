import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Clock, ExternalLink, Calendar } from 'lucide-react';

const History = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400">Loading your history...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <Clock size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Past Requests</h1>
          <p className="text-gray-400">Review your previous dependency recommendations.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border-dashed border-border/50">
          <p className="text-gray-500 italic">No history found. Start by creating a new request!</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-primary hover:underline font-bold"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div 
              key={index} 
              className="glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-smooth group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <Calendar size={10} /> {formatDate(item.createdAt)}
                </div>
                <h3 className="text-xl font-bold">{item.feature}</h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.dependencies.slice(0, 3).map((dep, i) => (
                    <span key={i} className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-border text-gray-400">
                      {dep.name.split(':').pop()}
                    </span>
                  ))}
                  {item.dependencies.length > 3 && (
                    <span className="text-[10px] text-gray-600">+{item.dependencies.length - 3} more</span>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/results', { state: { formData: item.config, requestId: item._id } })}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-primary/20 rounded-xl transition-smooth text-sm font-bold border border-border hover:border-primary/50"
              >
                View Results <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
