import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Copy, Check, ChevronLeft, FileCode, Terminal, BookOpen } from 'lucide-react';

const Setup = () => {
  const { getToken } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!state?.requestId || !state?.dependency) {
      navigate('/dashboard');
      return;
    }
    fetchSetup();
  }, []);

  const fetchSetup = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/setup`, {
        requestId: state.requestId,
        dependencyName: state.dependency.name
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSteps(response.data.setupSteps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400">Crafting the implementation guide...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-smooth"
      >
        <ChevronLeft size={20} /> Back to Results
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-8 rounded-3xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">{state.dependency.name}</h1>
          <p className="text-gray-400">{state.dependency.description}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl text-primary font-bold text-sm h-fit">
          {state.dependency.rank_tag}
        </div>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={index} className="relative pl-12 border-l border-border/50">
            <div className="absolute left-[-16px] top-0 w-8 h-8 rounded-full bg-dark-bg border border-border flex items-center justify-center font-bold text-primary text-sm shadow-xl">
              {index + 1}
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-bold flex items-center gap-3">
                {step.title}
                {step.filename && (
                  <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-border">
                    {step.filename}
                  </span>
                )}
              </h3>
              <p className="text-gray-400 mt-2">{step.content}</p>
            </div>

            {step.code && (
              <div className="relative group">
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-smooth">
                  <button 
                    onClick={() => copyToClipboard(step.code, index)}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-border rounded-lg text-gray-400 hover:text-white transition-smooth"
                  >
                    {copied === index ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <pre className="bg-card-bg p-6 rounded-2xl border border-border overflow-x-auto font-mono text-sm leading-relaxed text-gray-300">
                  <code>{step.code}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-8 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center gap-4 text-green-400/80">
        <div className="p-3 bg-green-500/10 rounded-full"><CheckCircle2 /></div>
        <div>
          <h4 className="font-bold">Ready to Launch!</h4>
          <p className="text-sm">Follow the testing instructions above to verify your implementation.</p>
        </div>
      </div>
    </div>
  );
};

// Simple icon wrapper
const CheckCircle2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
);

export default Setup;
