import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, Plus, AlertCircle, CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dependencies, setDependencies] = useState([]);
  const [requestId, setRequestId] = useState(null);
  const [error, setError] = useState(null);
  const [moreLoading, setMoreLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!state?.formData) {
      navigate('/dashboard');
      return;
    }
    
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    fetchDependencies();
  }, []);

  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        feature: state.formData.feature,
        kotlinVersion: state.formData.kotlinVersion || '1.9.0',
        gradleVersion: state.formData.gradleVersion || '8.0',
        uiType: state.formData.uiType || 'Compose',
        minSdk: state.formData.minSdk || '24',
        description: state.formData.description || ''
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/dependencies`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDependencies(response.data.dependencies);
      setRequestId(response.data.requestId);
      setCredits(response.data.remainingCredits);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMore = async () => {
    setMoreLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/dependencies/more`, { requestId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.dependencies.length > 0) {
        setDependencies([...dependencies, ...response.data.dependencies]);
      } else {
        alert(response.data.message || 'No more alternatives available');
      }
    } catch (err) {
      // Error handled
    } finally {
      setMoreLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary">
          <Sparkles size={24} />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black">Analyzing Requirements</h2>
        <p className="text-gray-500 font-medium">Generating the best matches for your requirements...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto mt-20 text-center p-12 glass rounded-[2.5rem] space-y-6">
      <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-red-500">
        <AlertCircle size={32} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black">Analysis Failed</h2>
        <p className="text-gray-400 leading-relaxed">{error}</p>
      </div>
      <button 
        onClick={() => navigate('/dashboard')} 
        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-smooth flex items-center justify-center gap-2"
      >
        <ArrowLeft size={18} /> Go Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-smooth mb-4"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-black tracking-tight">
            Recommendations for <span className="text-primary italic">"{state.formData.feature}"</span>
          </h1>
          <p className="text-gray-500 font-medium">We've found {dependencies.length} architectural matches for your project.</p>
        </div>

        <button 
          onClick={handleGenerateMore}
          disabled={moreLoading}
          className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 hover:border-primary/30 transition-smooth disabled:opacity-50 group"
        >
          {moreLoading ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <><Plus size={20} className="text-primary group-hover:rotate-90 transition-smooth" /> Generate Alternatives</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dependencies.map((dep, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={index}
            className="glass p-8 rounded-4xl flex flex-col justify-between hover:glass-hover transition-smooth group cursor-pointer relative overflow-hidden"
            onClick={() => navigate('/setup', { state: { requestId, dependency: dep } })}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-smooth"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-primary/10 text-[10px] font-black px-3 py-1.5 rounded-full border border-primary/20 text-primary uppercase tracking-[0.2em] shadow-sm">
                  {dep.rank_tag}
                </span>
                <div className="p-2 rounded-xl bg-white/5 text-gray-500 group-hover:text-primary group-hover:bg-primary/10 transition-smooth shadow-inner">
                  <ChevronRight size={18} />
                </div>
              </div>

              <h3 className="text-xl font-black mb-3 break-all leading-tight group-hover:text-primary transition-smooth text-glow">{dep.name}</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed line-clamp-3 font-medium">{dep.description}</p>
              
              <div className="space-y-3 mb-8">
                {dep.pros.slice(0, 2).map((pro, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                    <div className="mt-1 bg-green-500/20 p-0.5 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                      <CheckCircle2 size={14} className="text-green-400" />
                    </div>
                    {pro}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">UseCase</span>
              <span className="text-[10px] text-primary font-black bg-primary/5 px-3 py-1 rounded-lg border border-primary/10 uppercase tracking-widest">{dep.best_for}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {credits !== null && (
        <div className="flex justify-center pt-10">
          <div className="glass px-8 py-4 rounded-2xl flex items-center gap-4 border-primary/20">
            <Sparkles size={18} className="text-primary" />
            <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">
              {credits === 'unlimited' ? 'Pro Plan: Unlimited Analysis' : `${credits} Credits Remaining`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
