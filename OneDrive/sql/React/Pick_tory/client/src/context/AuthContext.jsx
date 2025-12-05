import React, { createContext, useState, useCallback, useEffect } from 'react';
import userApi from '../api/userApi';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 페이지 로드 시 사용자 정보 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 빠른 복원을 위해 localStorage에 저장된 user를 먼저 복원
        const saved = localStorage.getItem('user');
        if (saved) {
          try { setUser(JSON.parse(saved)); } catch(e) { console.warn('Invalid saved user'); }
        }

        const token = localStorage.getItem('token');
        if (token) {
          // 서버에서 최신 사용자 정보 조회(토큰 유효성 검사 및 데이터 동기화)
          try {
            const response = await userApi.getMe();
            setUser(response.data);
          } catch (err) {
            // 인증 실패(401)이면 토큰/저장 사용자 제거. 그 외(네트워크 등)는 보존.
            const status = err.response?.status;
            if (status === 401) {
              console.warn('Token invalid, clearing stored auth');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            } else {
              console.warn('Auth check failed (non-auth error):', err);
              // don't remove token/user for transient errors
            }
          }
        }
      } catch (err) {
        console.error('Auth check unexpected error:', err);
        // don't aggressively remove token here; handled above
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await userApi.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      // 사용자 정보도 로컬스토리지에 저장해 새로고침 시 빠르게 복원
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await userApi.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // 사용자 포인트 등 일부 필드만 갱신할 때 사용
  const updateUserPoints = useCallback((newPoints) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, points: newPoints };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      // const response = await userApi.updateProfile(user._id, profileData);
      // setUser(response.data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserPoints,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
