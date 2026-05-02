import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, LifeBuoy } from 'lucide-react';

const Support = () => {
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.target);
    formData.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      }).then((res) => res.json());

      if (res.success) {
        setStatus('success');
        e.target.reset();
      } else {
        setStatus('error');
        setMessage(res.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to send message. Please check your connection.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-12">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-2"
        >
          <LifeBuoy size={32} />
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight">How can we help?</h1>
        <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">
          Have a question or feedback? We'd love to hear from you. Our team typically responds within 24 hours.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Mail, title: 'Email Support', detail: 'support@stackpilot.com' },
          { icon: MessageSquare, title: 'Community', detail: 'Discord Server' },
          { icon: Send, title: 'Direct Chat', detail: 'Available for Pro' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl text-center space-y-3"
          >
            <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
              <item.icon size={24} />
            </div>
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.detail}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 md:p-16 rounded-[3rem] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 ml-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                required
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-hidden focus:border-primary/50 transition-smooth font-medium"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 ml-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                placeholder="john@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-hidden focus:border-primary/50 transition-smooth font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 ml-1">Subject</label>
            <input 
              type="text" 
              name="subject"
              required
              placeholder="How can we help?"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-hidden focus:border-primary/50 transition-smooth font-medium"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 ml-1">Message</label>
            <textarea 
              name="message"
              required
              rows="5"
              placeholder="Tell us more about your inquiry..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-hidden focus:border-primary/50 transition-smooth font-medium resize-none"
            ></textarea>
          </div>

          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl flex items-center gap-4 text-green-400"
            >
              <CheckCircle2 size={24} />
              <p className="font-bold">Message sent successfully! We'll get back to you soon.</p>
            </motion.div>
          ) : status === 'error' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-400"
            >
              <AlertCircle size={24} />
              <p className="font-bold">{message}</p>
            </motion.div>
          ) : (
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary py-5 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-primary/30 transition-smooth flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Send Message <Send size={20} /></>
              )}
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Support;
