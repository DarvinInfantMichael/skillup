const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.message || 'Failed to sign in');
    }
    
    // Save token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    
    return data;
};

export const registerUser = async (name, email, password, role) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.message || 'Failed to create account');
    }
    
    // Save token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    
    return data;
};

export const getProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });
        
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        return null;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
