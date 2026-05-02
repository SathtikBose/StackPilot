import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { ChevronRight, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

const Results = () => {
  const { getToken } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dependencies, setDependencies] = useState([]);
  const [requestId, setRequestId] = useState(null);
  const [error, setError] = useState(null);
  const [moreLoading, setMoreLoading] = useState(false);

  useEffect(() => {
    if (!state?.formData) {
      navigate('/dashboard');
      return;
    }
    fetchDependencies();
  }, []);

  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/dependencies`, state.formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDependencies(response.data.dependencies);
      setRequestId(response.data.requestId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMore = async () => {
    setMoreLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/dependencies/more`, { requestId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.dependencies.length > 0) {
        setDependencies([...dependencies, ...response.data.dependencies]);
      } else {
        alert(response.data.message || 'No more alternatives available');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMoreLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 animate-pulse">Consulting the AI experts...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto mt-20 text-center p-8 glass rounded-2xl">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
      <h2 className="text-xl font-bold mb-2">Oops!</h2>
      <p className="text-gray-400 mb-6">{error}</p>
      <button onClick={() => navigate('/dashboard')} className="text-primary hover:underline">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Recommended for "{state.formData.feature}"</h1>
          <p className="text-gray-400">Select a dependency to view the setup guide.</p>
        </div>
        <button 
          onClick={handleGenerateMore}
          disabled={moreLoading}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-white/5 transition-smooth disabled:opacity-50"
        >
          {moreLoading ? 'Searching...' : <><Plus size={18} /> Generate More</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dependencies.map((dep, index) => (
          <div 
            key={index}
            className="glass p-6 rounded-2xl flex flex-col justify-between hover:border-primary/50 transition-smooth group cursor-pointer"
            onClick={() => navigate('/setup', { state: { requestId, dependency: dep } })}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-white/5 text-xs font-mono px-2 py-1 rounded border border-border text-gray-300">
                  {dep.rank_tag}
                </span>
                <ChevronRight size={18} className="text-gray-600 group-hover:text-primary transition-smooth" />
              </div>
              <h3 className="text-lg font-bold mb-2 break-all">{dep.name}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">{dep.description}</p>
              
              <div className="space-y-2 mb-6">
                {dep.pros.slice(0, 2).map((pro, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-green-400/80">
                    <CheckCircle2 size={12} /> {pro}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-border flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Best For</span>
              <span className="text-xs text-primary font-medium">{dep.best_for}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
