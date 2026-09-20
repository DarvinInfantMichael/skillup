import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logoutUser } from '../apis/authApi';
import { fetchAIRecommendations } from '../apis/aiApi';
import { LogOut, User as UserIcon, Shield, Loader2, Award, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminPanel from '../components/AdminPanel';
import TrainerPanel from '../components/TrainerPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [aiAdvice, setAiAdvice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getProfile();
      if (!profileData) {
        navigate('/login');
      } else {
        setUser(profileData);
      }
      setIsPending(false);
    };
    
    fetchProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    await logoutUser();
    navigate('/login');
  };

  const handleGetAdvice = async () => {
      setIsGenerating(true);
      setAiAdvice('');
      try {
          const advice = await fetchAIRecommendations();
          setAiAdvice(advice);
      } catch (err) {
          alert("AI Error: " + err.message);
      } finally {
          setIsGenerating(false);
      }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Helper to parse scores (handles "95", "95/100", "A+", "B")
  const parseScore = (scoreStr) => {
      if (!scoreStr) return 0;
      const s = scoreStr.toString().toUpperCase().trim();
      if (s.includes('/')) return parseInt(s.split('/')[0]) || 0;
      if (s === 'O' || s === 'S' || s === 'A+') return 100;
      if (s === 'A') return 90;
      if (s === 'B+' || s === 'B') return 80;
      if (s === 'C+' || s === 'C') return 70;
      if (s === 'D+' || s === 'D') return 60;
      if (s === 'F') return 40;
      return parseInt(s) || 0;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12">
      {/* Header */}
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg shadow-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-neutral-400">Welcome back, {user.name}</p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-2 bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <UserIcon size={20} className="text-blue-500" />
            Profile Details
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-neutral-500">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-neutral-800/50">
              <div className="space-y-1">
                <p className="text-sm text-neutral-500">Account ID</p>
                <p className="font-mono text-xs text-neutral-400 bg-neutral-950 p-2 rounded-md inline-block">
                  {user._id}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security / Role Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-b from-neutral-900/50 to-neutral-900/20 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Shield size={20} className="text-purple-500" />
            Security & Role
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800/50 flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Current Role</p>
                <p className="font-semibold capitalize text-purple-400">
                  {user.role || 'User'}
                </p>
              </div>
              {user.role === 'admin' && (
                <div className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-md font-bold uppercase tracking-wider">
                  Admin
                </div>
              )}
            </div>
            
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800/50">
              <p className="text-sm text-neutral-400 mb-1">Email Verification</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <p className="text-sm font-medium">
                  {user.emailVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Student Grades Section */}
        {user.role === 'student' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:col-span-3 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mt-2"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                <Award size={20} className="text-blue-500" />
                My Academic Record
              </h2>
              {user.grades && user.grades.length > 0 && (
                <button 
                  onClick={handleGetAdvice} 
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl transition-all duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/10 active:scale-95"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {isGenerating ? 'Analyzing Grades...' : 'Get AI Advice'}
                </button>
              )}
            </div>

            {aiAdvice && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  className="mb-8 p-5 bg-gradient-to-r from-purple-900/20 to-indigo-900/10 border border-purple-500/20 rounded-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />
                    <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <Sparkles size={16}/> LLaMA-3 Analysis
                    </h4>
                    <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                        {aiAdvice}
                    </p>
                </motion.div>
            )}

            {user.grades && user.grades.length > 0 ? (
                <>
                  <div className="mb-8 p-6 bg-neutral-950/50 rounded-2xl border border-neutral-800/50 h-64">
                    <h3 className="text-sm font-medium text-neutral-400 flex items-center gap-2 mb-4">
                        <TrendingUp size={16} className="text-blue-400" />
                        Performance Growth
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={user.grades.map(g => ({ subject: g.subject, score: parseScore(g.score), date: new Date(g.date).toLocaleDateString() }))}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                            <XAxis dataKey="subject" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px' }}
                                itemStyle={{ color: '#60a5fa' }}
                            />
                            <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#60a5fa', strokeWidth: 0 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {user.grades.map((grade, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 + (idx * 0.1) }}
                          className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-xl relative overflow-hidden group hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-default"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/4 group-hover:bg-blue-500/20 transition-colors duration-500" />
                            <h3 className="font-semibold text-neutral-200 mb-1">{grade.subject}</h3>
                            <p className="text-3xl font-bold text-blue-400 mb-4 group-hover:scale-110 origin-left transition-transform duration-300">{grade.score}</p>
                            <div className="flex justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-800 group-hover:border-neutral-700 transition-colors">
                                <span>{new Date(grade.date).toLocaleDateString()}</span>
                                <span>{grade.gradedByName || 'Trainer'}</span>
                            </div>
                        </motion.div>
                    ))}
                  </div>
                </>
            ) : (
                <div className="text-center py-8 bg-neutral-950 border border-neutral-800/80 rounded-xl">
                    <p className="text-neutral-500 text-sm">No grades have been assigned to you yet.</p>
                </div>
            )}
          </motion.div>
        )}

        {user.role === 'admin' && (
          <AdminPanel currentUser={user} />
        )}
        {user.role === 'staff' && (
          <TrainerPanel currentUser={user} />
        )}
      </main>
    </div>
  );
}
