import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const DEFAULT_USER = {
  id: "GUEST",
  name: "Guest User",
  role: "public",
  roleName: "Public Observer",
  department: "Visitor",
  email: "",
  avatar: "GU",
  authenticated: false,
  loginMethod: null
};

// Simulated user database
const USER_DB = {
  'admin@vyaadhishield.in': { password: 'Admin@123', role: 'admin', name: 'Selvamani IAS', roleName: 'System Administrator', department: 'Health & Family Welfare, GoTN', avatar: 'SA' },
  'kavitha@tn.gov.in': { password: 'Officer@123', role: 'officer', name: 'Dr. Kavitha Sundaram', roleName: 'Chief Health Surveillance Officer', department: 'Directorate of Public Health, TN', avatar: 'KS' },
  'rajesh@tn.gov.in': { password: 'Officer@123', role: 'officer', name: 'Dr. Rajesh Kumar', roleName: 'District Health Officer', department: 'DPH Chennai Division', avatar: 'RK' },
  'fieldworker@tn.gov.in': { password: 'Field@123', role: 'health_worker', name: 'Murugan S', roleName: 'Field Health Worker', department: 'PHC Tondiarpet', avatar: 'MS' },
  'citizen@gmail.com': { password: 'Citizen@123', role: 'public', name: 'Priya Lakshmi', roleName: 'Verified Citizen', department: 'Public Portal', avatar: 'PL' },
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

  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    sessionStorage.setItem('vyaadhi_user', JSON.stringify(user));
  }, [user]);

  // Email + Password Login
  const loginWithEmail = useCallback((email, password) => {
    setLoginError('');
    const dbUser = USER_DB[email.toLowerCase()];
    
    if (!dbUser) {
      setLoginError('No account found with this email. Try signing up.');
      return false;
    }
    if (dbUser.password !== password) {
      setLoginError('Incorrect password. Please try again.');
      return false;
    }

    setUser({
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      name: dbUser.name,
      role: dbUser.role,
      roleName: dbUser.roleName,
      department: dbUser.department,
      email: email,
      avatar: dbUser.avatar,
      authenticated: true,
      loginMethod: 'email'
    });
    return true;
  }, []);

  // Google OAuth Login (simulated with real-looking flow)
  const loginWithGoogle = useCallback(() => {
    setLoginError('');
    // Simulate Google OAuth popup delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const googleUser = {
          id: `USR-G-${Date.now().toString(36).toUpperCase()}`,
          name: 'Sathiyanarayanan S',
          role: 'officer',
          roleName: 'Health Surveillance Officer',
          department: 'VyaadhiShield Platform',
          email: 'sathiyanarayanan.s@gmail.com',
          avatar: 'SS',
          authenticated: true,
          loginMethod: 'google',
          picture: null
        };
        setUser(googleUser);
        resolve(true);
      }, 1500);
    });
  }, []);

  // GitHub OAuth Login (simulated)
  const loginWithGithub = useCallback(() => {
    setLoginError('');
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({
          id: `USR-GH-${Date.now().toString(36).toUpperCase()}`,
          name: 'sathiyanarayanan17',
          role: 'admin',
          roleName: 'Developer Admin',
          department: 'VyaadhiShield Engineering',
          email: 'sathiyanarayanan17@github.com',
          avatar: 'S1',
          authenticated: true,
          loginMethod: 'github'
        });
        resolve(true);
      }, 1500);
    });
  }, []);

  // Role-based quick login (for demo)
  const loginAsRole = useCallback((role, customName) => {
    setLoginError('');
    const roleMap = {
      admin: { name: 'Selvamani IAS', roleName: 'System Administrator', department: 'Health & Family Welfare, GoTN', avatar: 'SA', email: 'admin@vyaadhishield.in' },
      officer: { name: 'Dr. Kavitha Sundaram', roleName: 'Chief Health Surveillance Officer', department: 'Directorate of Public Health, TN', avatar: 'KS', email: 'kavitha@tn.gov.in' },
      health_worker: { name: 'Murugan S', roleName: 'Field Health Worker', department: 'PHC Tondiarpet', avatar: 'MS', email: 'fieldworker@tn.gov.in' },
      public: { name: 'Tamil Nadu Citizen', roleName: 'Verified Resident', department: 'Public Portal', avatar: 'TC', email: 'citizen@gmail.com' },
    };
    const data = roleMap[role] || roleMap.public;
    setUser({
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      name: customName || data.name,
      role: role,
      roleName: data.roleName,
      department: data.department,
      email: data.email,
      avatar: data.avatar,
      authenticated: true,
      loginMethod: 'role_select'
    });
  }, []);

  // Signup
  const signup = useCallback((formData) => {
    setLoginError('');
    setUser({
      id: `USR-NEW-${Date.now().toString(36).toUpperCase()}`,
      name: formData.fullName,
      role: formData.role || 'public',
      roleName: formData.role === 'officer' ? 'District Health Officer' : (formData.role === 'admin' ? 'Administrator' : (formData.role === 'health_worker' ? 'Health Worker' : 'Verified Citizen')),
      department: formData.organization || 'Public Portal',
      email: formData.email,
      avatar: formData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      authenticated: true,
      loginMethod: 'signup'
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(DEFAULT_USER);
    sessionStorage.removeItem('vyaadhi_user');
    setLoginError('');
  }, []);

  // Legacy support
  const login = loginAsRole;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithEmail,
      loginWithGoogle,
      loginWithGithub,
      loginAsRole,
      signup,
      logout,
      loginError,
      setLoginError,
      isAuthenticated: user.authenticated
    }}>
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
