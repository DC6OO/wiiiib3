import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../api/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then((data) => setUser(data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
