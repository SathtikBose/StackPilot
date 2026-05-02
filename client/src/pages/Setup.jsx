import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Copy, Check, ChevronLeft, FileCode, Terminal, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Setup = () => {
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
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/setup`, {
        requestId: state.requestId,
        dependencyName: state.dependency.name
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSteps(response.data.setupSteps);
    } catch (err) {
      // Error handled silently
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary">
          <Terminal size={24} />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black">Crafting Guide</h2>
        <p className="text-gray-500 font-medium">Generating step-by-step implementation instructions...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-10">
      <button 
        onClick={() => navigate(-1)}
        className="text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-smooth"
      >
        <ChevronLeft size={16} /> Back to Results
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
              <FileCode size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">{state.dependency.name}</h1>
          </div>
          <p className="text-gray-400 font-medium leading-relaxed max-w-2xl">{state.dependency.description}</p>
        </div>

        <div className="relative z-10">
          <div className="bg-primary text-[10px] font-black px-4 py-2 rounded-xl text-white uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
            {state.dependency.rank_tag}
          </div>
        </div>
      </motion.div>

      <div className="space-y-16">
        {steps.map((step, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            key={index} 
            className="relative pl-20"
          >
            {/* Timeline Line */}
            <div className="absolute left-[1.15rem] top-10 -bottom-16 w-0.5 bg-linear-to-b from-primary/30 to-transparent"></div>
            
            <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-dark-bg border border-primary/30 flex items-center justify-center font-black text-primary text-sm shadow-[0_0_15px_rgba(170,59,255,0.2)] z-10">
              {index + 1}
            </div>
            
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h3 className="text-2xl font-black text-white text-glow">{step.title}</h3>
                {step.filename && (
                  <span className="text-[10px] font-black font-mono text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 uppercase tracking-[0.2em]">
                    {step.filename}
                  </span>
                )}
              </div>
              <p className="text-gray-400 font-medium leading-relaxed text-lg max-w-4xl">{step.content}</p>
            </div>

            {step.code && (
              <div className="relative group">
                <div className="absolute right-6 top-6 z-20 opacity-0 group-hover:opacity-100 transition-smooth">
                  <button 
                    onClick={() => copyToClipboard(step.code, index)}
                    className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-primary transition-smooth shadow-2xl"
                  >
                    {copied === index ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/5 via-transparent to-transparent rounded-4xl pointer-events-none border border-white/5 group-hover:border-primary/20 transition-smooth"></div>
                
                <pre className="glass p-10 rounded-4xl overflow-x-auto font-mono text-sm leading-relaxed text-gray-300 selection:bg-primary/30 shadow-2xl">
                  <code className="block min-w-full">{step.code}</code>
                </pre>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-10 bg-green-500/5 border border-green-500/10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
      >
        <div className="p-5 bg-green-500/10 rounded-3xl text-green-400 shadow-2xl shadow-green-500/10">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h4 className="text-2xl font-black text-white">Integration Ready!</h4>
          <p className="text-gray-400 font-medium">You've successfully implemented the {state.dependency.name} feature. Build and run your project to verify the results.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="md:ml-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-smooth"
        >
          Finish Guide
        </button>
      </motion.div>
    </div>
  );
};

export default Setup;
