import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token or fetch user profile if endpoint exists
      // For MVP, just assuming token validity or basic decode if needed
      // TODO: Verify token with backend
      setUser({ token }); 
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      setUser({ ...res.data.user, token: res.data.token });
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
