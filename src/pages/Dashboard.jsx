import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logoutUser } from '../apis/authApi';
import { LogOut, User as UserIcon, Shield, Loader2 } from 'lucide-react';
import AdminPanel from '../components/AdminPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(true);

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

  if (isPending) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

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
        <div className="md:col-span-2 bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
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
        </div>

        {/* Security / Role Card */}
        <div className="bg-gradient-to-b from-neutral-900/50 to-neutral-900/20 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
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
        </div>

        {user.role === 'admin' && (
          <AdminPanel currentUser={user} />
        )}
      </main>
    </div>
  );
}
