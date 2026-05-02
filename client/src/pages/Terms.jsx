import { motion } from 'framer-motion';
import { Gavel, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      icon: CheckCircle2,
      title: 'Usage Terms',
      content: 'By using StackPilot, you agree to use the service for its intended purpose: Android project configuration and dependency management. Any attempt to abuse the credit system or reverse-engineer the AI logic is prohibited.'
    },
    {
      icon: ShieldAlert,
      title: 'Liability',
      content: 'StackPilot provides recommendations based on AI models. While we strive for accuracy, we are not responsible for build failures, security vulnerabilities, or project delays resulting from the use of our generated configurations.'
    },
    {
      icon: Gavel,
      title: 'Account Terms',
      content: 'You are responsible for maintaining the security of your account. We reserve the right to suspend accounts that violate our terms or engage in fraudulent payment activities.'
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
          <Gavel size={32} />
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight">Terms of Service</h1>
        <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">
          Please read these terms carefully before using our platform.
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
          <h2 className="text-2xl font-black">Fair Use</h2>
        </div>
        <div className="prose prose-invert max-w-none text-gray-400 font-medium leading-relaxed">
          <p>
            We believe in empowering developers. Our 10-credit daily limit for free users is designed to provide a high-quality experience for students and hobbyists. Professional users are encouraged to upgrade to Pro for unlimited project generations.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
