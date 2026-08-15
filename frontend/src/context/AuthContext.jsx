import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USER = {
  id: "USR-TN-8921",
  name: "Dr. Kavitha Sundaram",
  role: "officer", // 'officer' | 'admin' | 'public'
  roleName: "Chief Health Surveillance Officer",
  department: "Directorate of Public Health, Tamil Nadu",
  email: "kavitha.sundaram@tn.gov.in",
  avatar: "KS",
  authenticated: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('vyaadhi_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    sessionStorage.setItem('vyaadhi_user', JSON.stringify(user));
  }, [user]);

  const login = (role = "officer", customName) => {
    let userData = { ...DEFAULT_USER };
    if (role === "admin") {
      userData = {
        id: "USR-TN-0001",
        name: customName || "Selvamani IAS",
        role: "admin",
        roleName: "Principal Secretary & System Administrator",
        department: "Health & Family Welfare Dept, Govt of Tamil Nadu",
        email: "admin.health@tn.gov.in",
        avatar: "SA",
        authenticated: true
      };
    } else if (role === "public") {
      userData = {
        id: "USR-PUB-4421",
        name: customName || "Tamil Nadu Citizen",
        role: "public",
        roleName: "Verified Resident",
        department: "Public Health Portal",
        email: "citizen@tn.gov.in",
        avatar: "TC",
        authenticated: true
      };
    } else {
      userData = {
        ...DEFAULT_USER,
        name: customName || DEFAULT_USER.name
      };
    }
    setUser(userData);
  };

  const logout = () => {
    setUser({
      id: "GUEST",
      name: "Guest User",
      role: "public",
      roleName: "Public Observer",
      department: "Visitor",
      email: "",
      avatar: "GU",
      authenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: user.authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
