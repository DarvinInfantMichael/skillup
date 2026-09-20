import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, TrendingUp, CheckCircle, Globe } from 'lucide-react';

const stats = [
  { label: 'Active Learners', value: '100,000+', icon: Users },
  { label: 'Partner Institutions', value: '50+', icon: Award },
  { label: 'Courses Completed', value: '1M+', icon: BookOpen },
  { label: 'Success Rate', value: '95%', icon: TrendingUp },
];

const partners = [
  { name: 'Tech Innovators University', logo: '🎓' },
  { name: 'Global Code Academy', logo: '💻' },
  { name: 'Future Leaders Institute', logo: '🌟' },
  { name: 'Data Science Hub', logo: '📊' },
  { name: 'Design Masters', logo: '🎨' },
];

const features = [
  {
    title: 'Industry-Relevant Skills',
    description: 'Learn the most in-demand skills chosen by top employers worldwide.',
    icon: CheckCircle,
  },
  {
    title: 'Expert Instructors',
    description: 'Get taught by industry veterans and academic excellence from partner institutions.',
    icon: Globe,
  },
  {
    title: 'Interactive Learning',
    description: 'Engage with practical projects, quizzes, and peer-to-peer discussions.',
    icon: BookOpen,
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Skillup</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Log in</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              Join the Learning Revolution
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Master New Skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Top Institutions</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Skillup bridges the gap between ambition and achievement. Connect with world-class universities and industry leaders to advance your career today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                >
                  Start Learning Now <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[2rem] transform rotate-3 scale-105 -z-10"></div>
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-32 bg-blue-50 rounded-xl p-4 flex flex-col justify-between">
                    <BookOpen className="text-blue-500 w-8 h-8" />
                    <span className="font-semibold text-slate-700">Web Development</span>
                  </div>
                  <div className="h-40 bg-indigo-50 rounded-xl p-4 flex flex-col justify-between">
                    <TrendingUp className="text-indigo-500 w-8 h-8" />
                    <span className="font-semibold text-slate-700">Data Science</span>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-40 bg-purple-50 rounded-xl p-4 flex flex-col justify-between">
                    <Award className="text-purple-500 w-8 h-8" />
                    <span className="font-semibold text-slate-700">UI/UX Design</span>
                  </div>
                  <div className="h-32 bg-emerald-50 rounded-xl p-4 flex flex-col justify-between">
                    <CheckCircle className="text-emerald-500 w-8 h-8" />
                    <span className="font-semibold text-slate-700">Marketing</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center space-y-2"
              >
                <div className="p-3 bg-white/10 rounded-2xl mb-2">
                  <stat.icon className="w-6 h-6 text-blue-200" />
                </div>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-blue-100 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Leading Institutions</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We partner with the world's most innovative organizations to bring you premium educational content.</p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 shadow-sm"
              >
                <span className="text-2xl">{partner.logo}</span>
                <span className="font-semibold text-slate-700">{partner.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose Skillup?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Everything you need to take your career to the next level, all in one platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-30 mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30 mix-blend-screen"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Career?</h2>
              <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">Join thousands of learners who have already taken the next step in their professional journey.</p>
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-blue-500 text-white rounded-full font-bold text-lg shadow-lg hover:bg-blue-400 transition-colors"
                >
                  Create Your Free Account
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">S</div>
            <span className="font-bold text-lg text-slate-900">Skillup</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Skillup Platform. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link to="#" className="text-slate-400 hover:text-slate-600 transition-colors">Privacy</Link>
            <Link to="#" className="text-slate-400 hover:text-slate-600 transition-colors">Terms</Link>
            <Link to="#" className="text-slate-400 hover:text-slate-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
