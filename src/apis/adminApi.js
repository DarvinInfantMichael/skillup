const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getAllUsers = async () => {
    const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
    return data;
};

export const createUser = async (userData) => {
    const res = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create user');
    return data;
};

export const updateUser = async (id, userData) => {
    const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update user');
    return data;
};

export const deleteUser = async (id) => {
    const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete user');
    return data;
};
