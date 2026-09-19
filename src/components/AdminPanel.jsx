import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit2, Loader2, ShieldAlert, X } from 'lucide-react';
import { getAllUsers, createUser, deleteUser, updateUser } from '../apis/adminApi';

export default function AdminPanel({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', email: '', password: '', role: 'student' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setSelectedUserId(user._id);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (modalMode === 'create') {
        await createUser(formData);
      } else {
        // If editing and password is blank, don't send it
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await updateUser(selectedUserId, updateData);
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        await fetchUsers();
      } catch (err) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="md:col-span-3 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="text-indigo-400" />
            User Management
          </h2>
          <p className="text-sm text-neutral-400 mt-1">Manage staff and student access to the platform.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Create User
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <ShieldAlert size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 text-sm text-neutral-400">
              <th className="pb-3 font-medium px-4">Name</th>
              <th className="pb-3 font-medium px-4">Email</th>
              <th className="pb-3 font-medium px-4">Role</th>
              <th className="pb-3 font-medium px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-neutral-800/50">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-neutral-800/30 transition-colors">
                <td className="py-4 px-4 text-neutral-200 font-medium">{user.name}</td>
                <td className="py-4 px-4 text-neutral-400">{user.email}</td>
                <td className="py-4 px-4">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                    user.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                    user.role === 'staff' ? 'bg-purple-500/10 text-purple-400' :
                    user.role === 'student' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-neutral-500/10 text-neutral-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Edit2 size={16} />
                    </button>
                    {user._id !== currentUser._id && (
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-8 text-neutral-500 text-sm">
            No users found.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-neutral-800">
              <h3 className="text-lg font-medium text-white">
                {modalMode === 'create' ? 'Create New User' : 'Edit User'}
              </h3>
              <button onClick={closeModal} className="text-neutral-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  {modalMode === 'create' ? 'Password' : 'New Password (Leave blank to keep)'}
                </label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required={modalMode === 'create'}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                >
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Super Admin</option>
                  <option value="user">Standard User</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
