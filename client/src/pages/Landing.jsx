import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Shield, Cpu, Code2, Layers, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI Dependency Selection',
      desc: 'Our neural engine analyzes your project requirements to find the perfect library versions.',
      icon: Cpu,
      color: 'text-primary'
    },
    {
      title: 'Smart Setup Guides',
      desc: 'Get step-by-step implementation instructions tailored to your specific tech stack.',
      icon: Code2,
      color: 'text-secondary'
    },
    {
      title: 'Conflict Prevention',
      desc: 'Detect and resolve version conflicts before they even enter your build.gradle.',
      icon: Shield,
      color: 'text-primary'
    }
  ];

  const pricing = [
    {
      name: 'Free Plan',
      price: '$0',
      credits: '10 Credits',
      features: ['Basic AI Analysis', 'Standard Setup Steps', 'Community Support'],
      highlight: false,
      button: 'Start Free'
    },
    {
      name: 'Pro Plan',
      price: '$19',
      credits: 'Unlimited Credits',
      features: ['Advanced AI Analysis', 'Priority Support', 'Full Architecture Patterns', 'Unlimited Everything'],
      highlight: true,
      button: 'Go Pro'
    }
  ];

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-sm font-bold mb-8"
          >
            <Zap size={14} fill="currentColor" />
            <span>Powering the next generation of Android apps</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]"
          >
            Build Apps <br />
            <span className="text-glow text-primary">Faster.</span> Smarter.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Stop wasting hours on dependency hell. Let StackPilot architect your project with AI-driven precision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button 
              onClick={() => navigate('/register')}
              className="bg-primary px-10 py-5 rounded-2xl font-black text-lg hover:shadow-[0_0_40px_rgba(170,59,255,0.3)] transition-smooth group flex items-center gap-3 justify-center"
            >
              Get Started Free <ArrowRight className="group-hover:translate-x-1 transition-smooth" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="glass px-10 py-5 rounded-2xl font-black text-lg hover:glass-hover transition-smooth flex items-center gap-3 justify-center"
            >
              View Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[2.5rem] hover:glass-hover transition-smooth group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-smooth"></div>
              <f.icon size={48} className={`${f.color} mb-8 group-hover:scale-110 transition-smooth`} />
              <h3 className="text-2xl font-black mb-4">{f.title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -z-10"></div>
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-5xl font-black">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 text-xl font-medium">Choose the plan that fits your ambition.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {pricing.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`glass p-12 rounded-[3rem] relative overflow-hidden border-2 transition-smooth group ${
                p.highlight ? 'border-primary shadow-2xl shadow-primary/20' : 'border-white/5'
              }`}
            >
              {p.highlight && (
                <div className="absolute top-8 right-8 bg-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                  Popular
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-2xl font-black mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black">{p.price}</span>
                  <span className="text-gray-500 font-bold">/lifetime</span>
                </div>
                <p className="text-primary font-bold mt-4 text-lg">{p.credits}</p>
              </div>

              <ul className="space-y-6 mb-12">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-4 text-gray-300 font-medium group/item">
                    <CheckCircle2 size={22} className={p.highlight ? 'text-primary' : 'text-gray-500'} />
                    <span className="group-hover/item:text-white transition-smooth">{f}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => navigate('/register')}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-smooth ${
                  p.highlight 
                  ? 'bg-primary hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]' 
                  : 'glass hover:glass-hover border border-white/10'
                }`}
              >
                {p.button}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="glass p-16 rounded-[4rem] text-center space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-smooth"></div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-5xl font-black tracking-tight">Ready to revolutionize your workflow?</h2>
            <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">Join thousands of developers building better Android apps with StackPilot.</p>
            <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate('/register')}
                className="bg-primary px-12 py-5 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-primary/30 transition-smooth group flex items-center gap-3 justify-center"
              >
                Start Now <ArrowRight className="group-hover:translate-x-1 transition-smooth" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
