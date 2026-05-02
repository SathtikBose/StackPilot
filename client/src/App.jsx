import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, History as HistoryIcon, LayoutDashboard, LogOut, Menu, X, User, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Setup from './pages/Setup';
import History from './pages/History';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = user ? [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: HistoryIcon },
    { name: 'Profile', path: '/profile', icon: User },
  ] : [];

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col font-sans selection:bg-primary/30 relative">
      {/* Background Orbs */}
      <div className="bg-glow">
        <div className="glow-orb" style={{ top: '-10%', left: '-10%' }}></div>
        <div className="glow-orb" style={{ bottom: '-10%', right: '-10%', animationDelay: '-5s', width: '800px', height: '800px' }}></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled ? 'bg-dark-bg/80 backdrop-blur-xl border-white/10 py-3' : 'bg-transparent border-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-xl text-white group-hover:rotate-12 transition-smooth shadow-lg shadow-primary/20">
              <Sparkles size={24} />
            </div>
            <span className="group-hover:text-primary transition-smooth">
              Stack<span className="text-primary group-hover:text-white transition-smooth">Pilot</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`text-sm font-bold transition-smooth flex items-center gap-2 ${
                  location.pathname === link.path ? 'text-primary' : 'text-gray-400 hover:text-white'
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
            {!user ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white">Sign In</Link>
                <Link to="/register" className="bg-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-smooth">
                  Get Started
                </Link>
              </div>
            ) : (
              <button 
                onClick={logout}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-smooth"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-400 p-2 glass rounded-xl">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 w-full bg-dark-bg/95 backdrop-blur-2xl border-b border-white/10 p-6 space-y-6 shadow-2xl"
            >
              {user ? (
                <>
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path} 
                      className="text-xl font-bold text-gray-300 hover:text-primary flex items-center gap-4 py-2"
                    >
                      <link.icon size={24} />
                      {link.name}
                    </Link>
                  ))}
                  <button 
                    onClick={logout}
                    className="w-full mt-4 flex items-center gap-4 py-4 px-6 bg-red-500/10 text-red-400 rounded-2xl font-bold"
                  >
                    <LogOut size={24} /> Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Link to="/login" className="py-4 text-center font-bold glass rounded-2xl">Sign In</Link>
                  <Link to="/register" className="py-4 text-center font-bold bg-primary rounded-2xl">Get Started</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Content */}
      <main className="grow pt-32 px-4 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-2">
            <Link to="/" className="text-xl font-black tracking-tighter">StackPilot</Link>
            <p className="text-gray-500 text-sm">Empowering Android developers with AI precision.</p>
          </div>
          <div className="flex gap-8 text-sm font-bold text-gray-400">
            <Link to="/privacy" className="hover:text-white transition-smooth">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-smooth">Terms</Link>
            <Link to="/support" className="hover:text-white transition-smooth">Support</Link>
          </div>
          <p className="text-gray-600 text-sm font-medium">&copy; {new Date().getFullYear()} StackPilot.</p>
        </div>
      </footer>
    </div>
  );
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        <Route path="/support" element={<Support />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
