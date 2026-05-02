import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Sparkles,
  LayoutDashboard,
  Database,
  Layers,
  Smartphone,
  Settings,
  Zap,
  CheckCircle2,
  History,
  ArrowRight,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    feature: "",
    kotlinVersion: "1.9.0",
    gradleVersion: "8.0",
    uiType: "Compose",
    minSdk: "24",
    description: "",
  });

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchUserData(), fetchHistory()]);
      setFetching(false);
      
      // Check for success status in URL
      const params = new URLSearchParams(window.location.search);
      if (params.get('status') === 'success') {
        setShowSuccessModal(true);
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    init();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const profileRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUserData(profileRes.data);
    } catch (error) {
      // Error handled
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistoryItems(res.data.history || []);
    } catch (error) {
      // Error handled
    }
  };

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-checkout-session`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Upgrade Error:", error);
      const message = error.response?.data?.error || error.message || "Failed to initiate upgrade";
      alert(`Upgrade Error: ${message}. Check console for details.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      navigate("/results", { state: { formData } });
    } catch (error) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 md:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em]"
          >
            <Activity size={14} /> System Online
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black tracking-tighter"
          >
            Hello,{" "}
            <span className="text-primary text-glow">
              {user?.name?.split(" ")[0] || "Developer"}
            </span>
          </motion.h1>
          <p className="text-gray-400 font-medium text-lg">
            Architect your next production-grade Android feature.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <motion.div
            whileHover={{ y: -5 }}
            className="glass px-8 py-4 rounded-3xl flex flex-col items-start min-w-[160px] border-primary/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-smooth">
              <Zap size={40} className="text-primary" />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
              Current Plan
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-black uppercase ${userData?.plan === "pro" ? "text-primary text-glow" : "text-white"}`}
              >
                {userData?.plan || "Free"}
              </span>
              {userData?.plan === "pro" && (
                <CheckCircle2 size={16} className="text-primary" />
              )}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass px-8 py-4 rounded-3xl flex flex-col items-start min-w-[160px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-smooth">
              <Sparkles size={40} className="text-primary" />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
              Available Credits
            </span>
            <span className="text-xl font-black text-white">
              {userData?.plan === "pro"
                ? "Unlimited"
                : `${userData?.credits || 0} left`}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Generator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-12"
        >
          <form
            onSubmit={handleSubmit}
            className="glass p-10 rounded-[3rem] space-y-10 shadow-2xl relative border-white/5 group"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-smooth"></div>

            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-full space-y-3">
                  <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                    <LayoutDashboard size={16} className="text-primary" />{" "}
                    Feature Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., Real-time Chat, Offline Database, Auth Flow"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-primary focus:bg-white/10 transition-smooth text-lg font-bold placeholder:text-gray-600"
                    value={formData.feature}
                    onChange={(e) =>
                      setFormData({ ...formData, feature: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                    <Database size={16} className="text-primary" /> Kotlin
                    Version
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-smooth font-mono text-primary"
                    value={formData.kotlinVersion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kotlinVersion: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                    <Settings size={16} className="text-primary" /> Gradle
                    Version
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-smooth font-mono text-primary"
                    value={formData.gradleVersion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gradleVersion: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                    <Layers size={16} className="text-primary" /> UI Framework
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-smooth appearance-none cursor-pointer font-bold"
                      value={formData.uiType}
                      onChange={(e) =>
                        setFormData({ ...formData, uiType: e.target.value })
                      }
                    >
                      <option value="Compose" className="bg-dark-bg text-white">
                        Jetpack Compose
                      </option>
                      <option value="XML" className="bg-dark-bg text-white">
                        XML Views
                      </option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <Layers size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                    <Smartphone size={16} className="text-primary" /> Min SDK
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-smooth font-bold"
                    value={formData.minSdk}
                    onChange={(e) =>
                      setFormData({ ...formData, minSdk: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-full space-y-3">
                  <label className="text-sm font-bold text-gray-400">
                    Implementation Details
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Briefly describe any specific requirements or technical constraints..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-primary transition-smooth resize-none font-medium"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-primary py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-smooth shadow-3xl shadow-primary/30 relative z-10 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                {loading ? (
                  <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Generate Architecture <Sparkles size={24} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* History Grid */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="text-primary" size={28} />
                <h2 className="text-3xl font-black tracking-tight">
                  Recent Work
                </h2>
              </div>
              <button
                onClick={() => navigate("/history")}
                className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
              >
                View Full History <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {historyItems.length > 0 ? (
                historyItems.slice(0, 4).map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass p-8 rounded-4xl group cursor-pointer hover:glass-hover transition-smooth relative overflow-hidden border-white/5"
                    onClick={() =>
                      navigate("/results", {
                        state: {
                          formData: { ...item.config, feature: item.feature },
                        },
                      })
                    }
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-smooth"></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] mb-1">
                          Feature Analysis
                        </span>
                        <h3 className="font-black text-xl group-hover:text-primary transition-smooth line-clamp-1">
                          {item.feature}
                        </h3>
                      </div>
                      <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-smooth shrink-0">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                    <div className="space-y-4 relative z-10">
                      <div className="grid grid-cols-2 gap-y-4 text-[10px] font-black uppercase tracking-[0.15em]">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-gray-600">Kotlin Version</span>
                          <span className="text-white text-xs">
                            {item.config?.kotlinVersion || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-gray-600">Gradle Version</span>
                          <span className="text-white text-xs">
                            {item.config?.gradleVersion || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-gray-600">UI Framework</span>
                          <span className="text-primary text-xs">
                            {item.config?.uiType || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-gray-600">Min SDK</span>
                          <span className="text-white text-xs">
                            {item.config?.minSdk || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                        <span>Project Entry</span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center glass rounded-[3rem] border-dashed border-white/10">
                  <Database className="mx-auto text-gray-600 mb-4" size={48} />
                  <p className="text-gray-500 font-bold text-lg">
                    No projects analyzed yet.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Your architectural history will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-10">
          <AnimatePresence>
            {userData?.plan === "free" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass p-10 rounded-[3rem] space-y-8 relative overflow-hidden group border-primary/30 bg-primary/5 shadow-3xl shadow-primary/10"
              >
                <div className="absolute -bottom-10 -right-10 p-4 opacity-10 group-hover:scale-150 transition-smooth rotate-12">
                  <Sparkles size={160} className="text-primary" />
                </div>

                <div className="space-y-6 relative z-10 text-center">
                  <div className="inline-block bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-2">
                    Get Unlimited
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black text-glow uppercase italic">Pro Plan</h3>
                    <p className="text-primary text-xl font-black uppercase tracking-widest">
                      Unlimited Credits
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-bold">
                    Unlock full access and power your workflow without credit limits.
                  </p>
                </div>

                <button
                  onClick={handleUpgrade}
                  className="w-full py-5 bg-primary rounded-2xl font-black text-lg hover:shadow-[0_0_40px_rgba(170,59,255,0.4)] transition-smooth relative z-10"
                >
                  Upgrade Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-10 rounded-[3rem] space-y-8 border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-2xl text-primary">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-black">Architect's Tip</h3>
            </div>
            <div className="space-y-6">
              <p className="text-gray-400 text-lg leading-relaxed italic font-medium">
                "Keep your UI stateless. Use StateFlow or LiveData to observe
                changes from your ViewModel, ensuring a clean unidirectional
                data flow."
              </p>
              <div className="h-px bg-white/10"></div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Mastering Jetpack Compose • 5 min read
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-dark-bg/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass p-10 rounded-[3rem] max-w-md w-full text-center space-y-8 border-primary/30 shadow-3xl shadow-primary/20 relative overflow-hidden"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary animate-bounce-slow">
                  <Sparkles size={48} />
                </div>
                
                <h2 className="text-4xl font-black tracking-tighter mb-4">
                  WELCOME TO <span className="text-primary text-glow">PRO</span>
                </h2>
                
                <p className="text-gray-400 font-medium leading-relaxed">
                  Your account has been upgraded successfully. You now have unlimited architectural recommendations and priority AI generation.
                </p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-5 bg-primary rounded-2xl font-black text-xl hover:shadow-lg hover:shadow-primary/30 transition-smooth"
              >
                Let's Build
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
