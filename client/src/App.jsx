import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser, useClerk, SignIn, SignUp } from '@clerk/clerk-react';
import { Home, History as HistoryIcon, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Setup from './pages/Setup';
import History from './pages/History';

const Layout = ({ children }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: HistoryIcon },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border p-4 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-primary p-1 rounded-lg text-white">SP</span>
            <span>Stack<span className="text-primary">Pilot</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <SignedIn>
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="text-sm font-medium text-gray-400 hover:text-white transition-smooth flex items-center gap-2"
                >
                  <link.icon size={16} />
                  {link.name}
                </Link>
              ))}
              <div className="h-6 w-px bg-border mx-2"></div>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <SignedIn>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </SignedIn>
            <SignedOut>
              <button 
                onClick={() => navigate('/sign-in')}
                className="text-sm font-bold bg-primary px-4 py-2 rounded-lg"
              >
                Sign In
              </button>
            </SignedOut>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-dark-bg border-b border-border p-4 space-y-4 animate-in slide-in-from-top-2">
            <SignedIn>
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium text-gray-400 hover:text-white transition-smooth flex items-center gap-2"
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm text-gray-400">{user?.primaryEmailAddress?.emailAddress}</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} StackPilot. Fly through dependencies.</p>
      </footer>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
          Modern Android Development <br/> 
          <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Accelerated.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Stop guessing dependencies. Get AI-powered recommendations and structured implementation guides in seconds.
        </p>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/sign-up')}
          className="px-8 py-4 bg-primary rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 transition-smooth"
        >
          Start Building Free
        </button>
        <button className="px-8 py-4 bg-white/5 border border-border rounded-2xl font-bold text-lg hover:bg-white/10 transition-smooth">
          View Templates
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-20">
        {['Room', 'Retrofit', 'Hilt', 'Compose'].map(tech => (
          <div key={tech} className="glass py-4 rounded-xl text-gray-500 font-mono text-sm border-dashed border-border/50">
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <>
            <SignedIn>
              <Navigate to="/dashboard" />
            </SignedIn>
            <SignedOut>
              <Landing />
            </SignedOut>
          </>
        } />
        <Route path="/dashboard" element={
          <SignedIn>
            <Dashboard />
          </SignedIn>
        } />
        <Route path="/results" element={
          <SignedIn>
            <Results />
          </SignedIn>
        } />
        <Route path="/setup" element={
          <SignedIn>
            <Setup />
          </SignedIn>
        } />
        <Route path="/sign-in/*" element={
          <div className="flex items-center justify-center min-h-[70vh]">
            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
          </div>
        } />
        <Route path="/sign-up/*" element={
          <div className="flex items-center justify-center min-h-[70vh]">
            <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
          </div>
        } />
        <Route path="/history" element={
          <SignedIn>
            <History />
          </SignedIn>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
