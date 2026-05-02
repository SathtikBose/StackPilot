import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Sparkles, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const [plan, setPlan] = useState('free');
  const [formData, setFormData] = useState({
    feature: '',
    kotlinVersion: '1.9.0',
    gradleVersion: '8.0',
    uiType: 'Compose',
    minSdk: '24',
    description: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await getToken();
      // Fetch History & Credits
      const historyRes = await axios.get(`${import.meta.env.VITE_API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCredits(historyRes.data.usage?.remainingCredits);
      
      // Fetch Profile/Plan
      const profileRes = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlan(profileRes.data.plan);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpgrade = async () => {
    try {
      const token = await getToken();
      await axios.post(`${import.meta.env.VITE_API_URL}/user/upgrade`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlan('pro');
      alert('Congratulations! You are now a Pro user.');
    } catch (error) {
      alert('Upgrade failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      navigate('/results', { state: { formData } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          What are we building today?
        </h1>
        <p className="text-gray-400">Enter your feature requirements and get tailored dependency recommendations.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden">
        {credits !== null && (
          <div className="absolute top-0 right-0 flex flex-col items-end">
            <div className="bg-primary/10 px-4 py-1 rounded-bl-xl border-b border-l border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
              {plan === 'pro' ? 'Pro Plan - Unlimited' : `${credits} Credits Remaining`}
            </div>
            {plan === 'free' && (
              <button 
                type="button"
                onClick={handleUpgrade}
                className="mr-2 mt-2 px-3 py-1 bg-primary text-[10px] font-bold text-white rounded-lg hover:opacity-90 transition-smooth shadow-lg shadow-primary/20"
              >
                UPGRADE TO PRO
              </button>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">Feature Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g., Local Database, Image Loading, Authentication"
              className="w-full bg-dark-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-smooth"
              value={formData.feature}
              onChange={(e) => setFormData({...formData, feature: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Kotlin Version</label>
            <input 
              required
              type="text" 
              className="w-full bg-dark-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-smooth"
              value={formData.kotlinVersion}
              onChange={(e) => setFormData({...formData, kotlinVersion: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Gradle Version</label>
            <input 
              required
              type="text" 
              className="w-full bg-dark-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-smooth"
              value={formData.gradleVersion}
              onChange={(e) => setFormData({...formData, gradleVersion: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">UI Framework</label>
            <select 
              className="w-full bg-dark-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-smooth"
              value={formData.uiType}
              onChange={(e) => setFormData({...formData, uiType: e.target.value})}
            >
              <option value="Compose">Jetpack Compose</option>
              <option value="XML">XML Views</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Min SDK</label>
            <input 
              required
              type="number" 
              className="w-full bg-dark-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-smooth"
              value={formData.minSdk}
              onChange={(e) => setFormData({...formData, minSdk: e.target.value})}
            />
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">Description (Optional)</label>
            <textarea 
              rows="3"
              placeholder="Any specific requirements or constraints?"
              className="w-full bg-dark-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-smooth"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-smooth shadow-lg shadow-primary/20"
        >
          {loading ? 'Analyzing...' : <>Find Dependencies <Sparkles size={20} /></>}
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
