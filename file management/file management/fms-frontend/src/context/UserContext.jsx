import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export { UserContext };

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: 'System Admin',
    avatar: null
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedAvatar || savedName || savedEmail || savedRole) {
      setUserData(prev => ({
        ...prev,
        avatar: savedAvatar || prev.avatar,
        fullName: savedName || prev.fullName,
        email: savedEmail || prev.email,
        role: savedRole || prev.role
      }));
    }
  }, []);

  const updateUserData = (newData) => {
    setUserData(prev => {
      const updated = { ...prev, ...newData };
      
      // Save to localStorage
      if (newData.avatar !== undefined) localStorage.setItem('userAvatar', newData.avatar || '');
      if (newData.fullName) localStorage.setItem('userName', newData.fullName);
      if (newData.email) localStorage.setItem('userEmail', newData.email);
      if (newData.role) localStorage.setItem('userRole', newData.role);
      
      return updated;
    });
  };

  const updateAvatar = (avatarUrl) => {
    setUserData(prev => ({ ...prev, avatar: avatarUrl }));
    localStorage.setItem('userAvatar', avatarUrl || '');
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
