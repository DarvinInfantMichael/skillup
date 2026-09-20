const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getStudents = async () => {
    const res = await fetch(`${API_URL}/api/staff/students`, {
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch students');
    return data;
};

export const addGrade = async (studentId, subject, score) => {
    const res = await fetch(`${API_URL}/api/staff/students/${studentId}/grades`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ subject, score }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add grade');
    return data;
};

export const editGrade = async (studentId, gradeId, subject, score) => {
    const res = await fetch(`${API_URL}/api/staff/students/${studentId}/grades/${gradeId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ subject, score }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to edit grade');
    return data;
};
