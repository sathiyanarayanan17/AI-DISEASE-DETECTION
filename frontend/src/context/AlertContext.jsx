import React, { createContext, useContext, useState, useEffect } from 'react';
import { DISTRICTS_DATA } from '../data/districtsData';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState(() => {
    // Generate initial alerts from high and medium risk districts
    return DISTRICTS_DATA
      .filter((d) => d.riskLevel === 'high' || d.riskLevel === 'medium')
      .map((d, index) => ({
        id: `ALT-${1000 + index}`,
        districtId: d.id,
        districtName: d.name,
        riskScore: d.riskScore,
        riskLevel: d.riskLevel,
        disease: d.riskScore > 80 ? 'Dengue' : (d.riskScore > 65 ? 'Cholera' : 'Malaria'),
        title: `${d.name}: ${d.riskLevel.toUpperCase()} Risk Outbreak Alert`,
        message: d.recommendation,
        timestamp: new Date(Date.now() - (index * 1800000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(Date.now() - (index * 1800000)).toISOString().split('T')[0],
        acknowledged: false,
        resolved: false,
        confidence: d.confidence
      }));
  });

  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(() => {
    return alerts.filter((a) => !a.acknowledged).length;
  });

  useEffect(() => {
    setUnreadCount(alerts.filter((a) => !a.acknowledged).length);
  }, [alerts]);

  const acknowledgeAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const resolveAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true, acknowledged: true } : a))
    );
  };

  const acknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  };

  const addToast = (title, message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadCount,
        acknowledgeAlert,
        resolveAlert,
        acknowledgeAll,
        addToast,
        toasts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
