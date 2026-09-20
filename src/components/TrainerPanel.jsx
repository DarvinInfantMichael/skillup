import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Loader2, Award, X, History, BarChart2, GraduationCap, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStudents, addGrade, editGrade } from '../apis/staffApi';

export default function TrainerPanel() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewHistoryMode, setViewHistoryMode] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    subject: '',
    score: '',
  });

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openGradeModal = (student, gradeToEdit = null) => {
    setSelectedStudent(student);
    setViewHistoryMode(false);
    if (gradeToEdit) {
        setFormData({ subject: gradeToEdit.subject, score: gradeToEdit.score });
        setEditingGradeId(gradeToEdit._id);
    } else {
        setFormData({ subject: '', score: '' });
        setEditingGradeId(null);
    }
    setIsModalOpen(true);
  };
  
  const openHistoryModal = (student) => {
    setSelectedStudent(student);
    setViewHistoryMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setEditingGradeId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (editingGradeId) {
          await editGrade(selectedStudent._id, editingGradeId, formData.subject, formData.score);
      } else {
          await addGrade(selectedStudent._id, formData.subject, formData.score);
      }
      await fetchStudents();
      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="md:col-span-3 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/5 transition-shadow duration-500"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BookOpen className="text-purple-400" />
            Trainer Dashboard
          </h2>
          <p className="text-sm text-neutral-400 mt-1">Review your students and assign grades for their courses.</p>
        </div>
      </div>

      {/* Stat Card */}
      <div className="mb-6">
        <div className="p-4 bg-neutral-950/50 border border-blue-500/20 rounded-2xl flex items-center gap-4 relative overflow-hidden group max-w-sm">
            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                <GraduationCap size={24} />
            </div>
            <div>
                <p className="text-neutral-400 text-sm font-medium">Total Assigned Students</p>
                <p className="text-2xl font-bold text-white">{students.length}</p>
            </div>
        </div>
      </div>

      {students.filter(s => s.grades && s.grades.length > 0).length > 0 && (
          <div className="mb-8 p-6 bg-neutral-950/50 rounded-2xl border border-neutral-800/50 h-64">
            <h3 className="text-sm font-medium text-neutral-400 flex items-center gap-2 mb-4">
                <BarChart2 size={16} className="text-purple-400" />
                Grades Assigned per Student
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={students.filter(s => s.grades?.length > 0).map(s => ({ name: s.name, grades: s.grades.length }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px' }}
                        itemStyle={{ color: '#c084fc' }}
                        cursor={{ fill: '#262626' }}
                    />
                    <Bar dataKey="grades" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </div>
      )}

      {error && !isModalOpen && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 text-sm text-neutral-400">
              <th className="pb-3 font-medium px-4">Student Name</th>
              <th className="pb-3 font-medium px-4">Email</th>
              <th className="pb-3 font-medium px-4">Total Grades</th>
              <th className="pb-3 font-medium px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-neutral-800/50">
            <AnimatePresence>
            {students.map((student, idx) => (
              <motion.tr 
                key={student._id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-neutral-800/50 transition-colors duration-200 group"
              >
                <td className="py-4 px-4 text-neutral-200 font-medium group-hover:text-white transition-colors">{student.name}</td>
                <td className="py-4 px-4 text-neutral-400">{student.email}</td>
                <td className="py-4 px-4 text-neutral-400">
                    <span className="bg-neutral-800 px-2.5 py-1 rounded-md text-xs font-semibold">
                        {student.grades?.length || 0}
                    </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                     <button 
                      onClick={() => openHistoryModal(student)}
                      disabled={!student.grades?.length}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 rounded-lg transition-all text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <History size={14} />
                      History
                    </button>
                    <button 
                      onClick={() => openGradeModal(student)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 active:scale-95 text-purple-400 rounded-lg transition-all text-xs font-medium hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <Plus size={14} />
                      Add Grade
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            </AnimatePresence>
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="text-center py-8 text-neutral-500 text-sm">
            No students found.
          </div>
        )}
      </div>

      {/* Grade / History Modal */}
      <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center p-5 border-b border-neutral-800 bg-neutral-900/50">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                {viewHistoryMode ? <History size={18} className="text-purple-400"/> : <Award size={18} className="text-purple-400"/>}
                {viewHistoryMode ? `${selectedStudent?.name}'s Grades` : (editingGradeId ? `Edit Grade for ${selectedStudent?.name}` : `Grade ${selectedStudent?.name}`)}
              </h3>
              <button onClick={closeModal} className="text-neutral-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {viewHistoryMode ? (
                <div className="p-5 max-h-96 overflow-y-auto">
                    {selectedStudent?.grades?.length > 0 ? (
                        <div className="space-y-3">
                            {selectedStudent.grades.map((grade, idx) => (
                                <div key={idx} className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl group relative">
                                    <div className="flex justify-between items-start mb-2 pr-8">
                                        <h4 className="font-medium text-white text-sm">{grade.subject}</h4>
                                        <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded text-sm">{grade.score}</span>
                                    </div>
                                    <div className="text-xs text-neutral-500 flex justify-between">
                                        <span>By {grade.gradedByName || 'Trainer'}</span>
                                        <span>{new Date(grade.date).toLocaleDateString()}</span>
                                    </div>
                                    <button 
                                        onClick={() => openGradeModal(selectedStudent, grade)}
                                        className="absolute top-3 right-3 p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                        title="Edit Grade"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-neutral-500 text-sm text-center py-4">No grades assigned yet.</p>
                    )}
                    <div className="pt-5 flex justify-end">
                        <button onClick={closeModal} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white rounded-xl text-sm font-medium transition-all">
                            Close
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Subject / Assignment Name</label>
                    <input 
                      type="text" 
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      placeholder="e.g. React Final Project"
                      className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      required
                    />
                  </div>
    
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Score / Grade</label>
                    <input 
                      type="text" 
                      value={formData.score}
                      onChange={e => setFormData({...formData, score: e.target.value})}
                      placeholder="e.g. 95/100 or A+"
                      className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      required
                    />
                  </div>
    
                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button" 
                      onClick={closeModal}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white py-2.5 rounded-xl font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-purple-500 hover:bg-purple-400 active:scale-95 hover:shadow-lg hover:shadow-purple-500/25 text-white py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (editingGradeId ? 'Save Changes' : 'Assign Grade')}
                    </button>
                  </div>
                </form>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}
