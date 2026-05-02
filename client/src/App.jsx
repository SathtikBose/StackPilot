import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Temporary components for Phase 1
const Dashboard = () => <div className="p-8 text-white">Dashboard (Phase 2)</div>;
const History = () => <div className="p-8 text-white">History (Phase 5)</div>;
const Layout = ({ children }) => (
  <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
    <nav className="border-b border-[#2e2e2e] p-4 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="text-xl font-bold tracking-tight text-primary">StackPilot</div>
      <div className="flex gap-4">
        {/* User button will go here */}
      </div>
    </nav>
    <main>{children}</main>
  </div>
);

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
              <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
                <h1 className="text-4xl font-bold">Fly through dependencies with StackPilot</h1>
                <p className="text-gray-400">The ultimate developer companion for Android dependency management.</p>
                <button 
                  onClick={() => window.location.href = '/sign-in'}
                  className="px-8 py-3 bg-primary rounded-lg font-semibold hover:opacity-90 transition-smooth"
                >
                  Get Started
                </button>
              </div>
            </SignedOut>
          </>
        } />
        <Route path="/dashboard" element={
          <SignedIn>
            <Dashboard />
          </SignedIn>
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
