const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const fetchAIRecommendations = async () => {
    const res = await fetch(`${API_URL}/api/ai/recommendations`, {
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch AI recommendation');
    return data.recommendation;
};
