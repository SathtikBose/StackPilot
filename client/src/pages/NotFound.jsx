import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
        <div className="w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-2xl"
      >
        <div className="relative">
          <motion.h1 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-[12rem] font-black leading-none text-white/5 tracking-tighter"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass size={120} className="text-primary animate-spin-slow opacity-20" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight">Lost in the Stack?</h2>
          <p className="text-gray-400 text-lg font-medium max-w-md mx-auto">
            The page you are looking for has been moved to a different module or deprecated from our repository.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-8 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-smooth group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-smooth" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-8 py-4 bg-primary rounded-2xl font-black text-white hover:shadow-lg hover:shadow-primary/30 transition-smooth group"
          >
            <Home size={18} />
            Return Home
          </button>
        </div>
      </motion.div>

      {/* Code Snippet Decoration */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-10 text-left font-mono text-xs text-primary/50 hidden lg:block"
      >
        <pre>
          {`// Exception Trace
try {
  navigate(requestedPath);
} catch (e) {
  throw new PageNotFoundException("404");
}`}
        </pre>
      </motion.div>
    </div>
  );
};

export default NotFound;
