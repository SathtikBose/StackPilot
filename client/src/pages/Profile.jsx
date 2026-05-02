import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, Key, Loader2, CheckCircle2, CreditCard, LogOut, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, fetchProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/user/profile`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProfile();
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
        currentPassword: passwords.current,
        newPassword: passwords.new
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Password updated successfully!');
      setPasswords({ current: '', new: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/payments/create-checkout-session`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      setError('Stripe checkout failed. Check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary mb-2">
            <User size={24} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Account Management</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Profile <span className="text-primary">Settings</span></h1>
          <p className="text-gray-500 font-medium">Customize your workspace and manage your subscription.</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-white transition-smooth"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <AnimatePresence>
        {(success || error) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 shadow-2xl ${
              success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {success ? <CheckCircle2 size={20} /> : <Shield size={20} />}
            {success || error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-10">
          {/* Personal Details */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-black">Personal Details</h2>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary focus:bg-white/10 transition-smooth font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-gray-500 cursor-not-allowed font-medium">
                    {user.email}
                  </div>
                </div>
              </div>
              <button 
                disabled={loading}
                className="px-10 py-4 bg-primary rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-smooth shadow-2xl shadow-primary/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
              </button>
            </form>
          </motion.section>

          {/* Security */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                <Key size={24} />
              </div>
              <h2 className="text-2xl font-black">Security</h2>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                  <input 
                    required
                    type="password" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary focus:bg-white/10 transition-smooth"
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                  <input 
                    required
                    type="password" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-secondary focus:bg-white/10 transition-smooth"
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  />
                </div>
              </div>
              <button 
                disabled={loading}
                className="px-10 py-4 bg-secondary rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-smooth shadow-2xl shadow-secondary/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </motion.section>
        </div>

        {/* Right Column: Status */}
        <div className="space-y-10">
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-indigo-500/10 transition-smooth"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-black">Subscription</h2>
            </div>
            
            <div className="text-center space-y-8 relative z-10">
              <div className="space-y-2">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Active Plan</div>
                <h3 className={`text-5xl font-black tracking-tighter ${user.plan === 'pro' ? 'text-primary' : 'text-white'}`}>
                  {user.plan === 'pro' ? 'PRO' : 'FREE'}
                </h3>
              </div>
              
              {user.plan === 'pro' ? (
                <div className="space-y-6">
                  <div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl text-primary text-sm font-bold leading-relaxed">
                    You have unlocked all premium features including unlimited AI requests.
                  </div>
                  <button className="w-full py-4 text-gray-500 text-xs font-black uppercase tracking-widest hover:text-white transition-smooth">
                    Manage Billing
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    Elevate your development experience with the Pro plan.
                  </p>
                  <ul className="text-left space-y-3">
                    {['Unlimited Credits', 'Priority AI Models', 'Advanced Guides'].map(item => (
                      <li key={item} className="flex items-center gap-3 text-xs font-bold text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={handleStripeCheckout}
                    disabled={loading}
                    className="w-full bg-linear-to-r from-primary to-secondary py-5 rounded-2xl font-black text-white hover:shadow-2xl hover:shadow-primary/30 transition-smooth flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={20} /> Upgrade to Pro</>}
                  </button>
                </div>
              )}
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-10 rounded-[2.5rem] space-y-6 border-red-500/10"
          >
            <div className="flex items-center gap-4 text-red-500">
              <Trash2 size={24} />
              <h2 className="text-xl font-black">Danger Zone</h2>
            </div>
            <p className="text-gray-500 text-sm font-medium">Permanently delete your account and all associated data.</p>
            <button className="text-red-500 text-sm font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
              Delete Account
            </button>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
