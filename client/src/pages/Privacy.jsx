import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Data Collection',
      content: 'We collect minimal data necessary to provide our services. This includes your email for authentication and the project requirements you provide to generate dependencies. We do not track your personal activities outside of StackPilot.'
    },
    {
      icon: Lock,
      title: 'Security',
      content: 'Your data is encrypted and stored securely. We use industry-standard practices to protect your information from unauthorized access, disclosure, or alteration. We do not store sensitive project code on our servers longer than necessary for processing.'
    },
    {
      icon: Shield,
      title: 'Third Parties',
      content: 'We do not sell your data to third parties. We only share information with essential service providers (like authentication and payment processing) required to operate the platform.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-16">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-2"
        >
          <Shield size={32} />
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight">Privacy Policy</h1>
        <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">
          Last updated: May 2026. Your privacy is our priority.
        </p>
      </div>

      <div className="grid gap-8">
        {sections.map((section, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass p-10 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="p-5 bg-white/5 rounded-3xl text-primary shrink-0">
              <section.icon size={32} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white">{section.title}</h2>
              <p className="text-gray-400 font-medium leading-relaxed text-lg">
                {section.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass p-10 rounded-[2.5rem] space-y-6"
      >
        <div className="flex items-center gap-4 text-white">
          <FileText className="text-primary" size={24} />
          <h2 className="text-2xl font-black">Full Transparency</h2>
        </div>
        <div className="prose prose-invert max-w-none text-gray-400 font-medium leading-relaxed">
          <p>
            StackPilot is committed to protecting the intellectual property of our users. When you use our AI tools to generate project configurations, the generated code is yours to keep and use in any project. We do not claim ownership of any architectural decisions or dependency structures recommended by our platform.
          </p>
          <p className="mt-4">
            If you have any questions about our privacy practices, please contact us through our Support page.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
