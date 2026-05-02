import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Key, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, { 
        email, 
        code, 
        newPassword 
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 rounded-full" />
        
        <h2 className="text-3xl font-bold mb-2 text-center bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          Reset Password
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {step === 1 && "Enter your email to receive a reset code."}
          {step === 2 && "Enter the 6-digit code sent to your email."}
          {step === 3 && "Create a new strong password."}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-sm mb-6 flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="email" 
                  className="w-full bg-dark-bg border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-smooth"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-smooth shadow-lg shadow-primary/20 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send Code <ArrowRight size={18} /></>}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">6-Digit Code</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  maxLength="6"
                  type="text" 
                  className="w-full bg-dark-bg border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-smooth text-center tracking-[1em] font-bold text-xl"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={() => code.length === 6 && setStep(3)}
              className="w-full bg-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-smooth shadow-lg shadow-primary/20 mt-4"
            >
              Verify Code <ArrowRight size={18} />
            </button>
            <button onClick={() => setStep(1)} className="w-full text-sm text-gray-400 hover:text-white transition-smooth text-center">
              Back to Email
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="password" 
                  className="w-full bg-dark-bg border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-smooth"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-smooth shadow-lg shadow-primary/20 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Reset Password <ArrowRight size={18} /></>}
            </button>
          </form>
        )}

        <div className="text-center mt-8 text-sm text-gray-400">
          Remembered your password? {' '}
          <Link to="/login" className="text-primary font-bold hover:underline">Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
