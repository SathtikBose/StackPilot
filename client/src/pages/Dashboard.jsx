import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const [formData, setFormData] = useState({
    feature: '',
    kotlinVersion: '1.9.0',
    gradleVersion: '8.0',
    uiType: 'Compose',
    minSdk: '24',
    description: ''
  });

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCredits(response.data.usage.remainingCredits);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, we'd call the API here and pass the results to the results page
      // Or just navigate to results and let it fetch
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
          <div className="absolute top-0 right-0 bg-primary/10 px-4 py-1 rounded-bl-xl border-b border-l border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
            {credits} Credits Remaining
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
