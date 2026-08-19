import React, { createContext, useContext, useState } from 'react';

const TRANSLATIONS = {
  en: {
    appTitle: "VyaadhiShield AI",
    tagline: "Tamil Nadu Disease Outbreak Early Warning Platform",
    dashboard: "Dashboard",
    alerts: "Alerts",
    forecast: "7-Day Forecast",
    realtime: "Real-Time Monitor",
    whatIf: "What-If Simulator",
    outbreakProb: "Outbreak Probability",
    anomalies: "Anomaly Detection",
    analytics: "AI Analytics",
    heatmap: "Heatmap Calendar",
    timeline: "Timeline Playback",
    correlations: "Correlation Matrix",
    ranking: "District Ranking",
    compare: "Compare Districts",
    reports: "Reports Generator",
    voiceAlerts: "Voice Alerts",
    smsAlerts: "SMS Alerts",
    whatsappBot: "WhatsApp Bot",
    emailScheduler: "Email Scheduler",
    citizenReport: "Citizen Report",
    resources: "Resource Allocation",
    hospitals: "Nearby Hospitals",
    budget: "Budget Estimator",
    publicDashboard: "Public View",
    prevention: "Prevention Tips",
    modelVersions: "Model Versions",
    apiMonitor: "API Monitor",
    audit: "Audit Trail",
    settings: "Settings",
    deploy: "Docker Deploy",
    login: "Login",
    logout: "Logout",
    districtsMonitored: "Districts Monitored",
    highRisk: "High Risk",
    mediumRisk: "Medium Risk",
    lowRisk: "Low Risk",
    modelConfidence: "Model Confidence",
    activeOutbreaks: "Active Outbreaks",
    sevenDayCases: "7-Day Cases",
    viewDetails: "View Details",
    exportCsv: "Export CSV",
    liveTelemetry: "Live Telemetry Active",
    dengue: "Dengue",
    cholera: "Cholera",
    malaria: "Malaria",
    vaccination: "Vaccination Tracker",
    contactTracing: "Contact Tracing",
    waterQuality: "Water Quality",
    mosquitoDensity: "Mosquito Density",
    epidemicSim: "Epidemic Simulator",
    notifications: "Notifications",
    dataExport: "Data Export",
    help: "Help & Docs",
    aadhaarVerify: "Aadhaar Verify",
    ihipIntegration: "IHIP Integration",
    autoRetrain: "Auto Retrain",
    offlinePwa: "Offline Mode"
  },
  ta: {
    appTitle: "வியாதிஷீல்டு AI",
    tagline: "தமிழ்நாடு நோய் பரவல் முன்கூட்டிய எச்சரிக்கை தளம்",
    dashboard: "கண்காணிப்பு பலகை",
    alerts: "எச்சரிக்கைகள்",
    forecast: "7 நாள் முன்னறிவிப்பு",
    realtime: "நேரலை கண்காணிப்பு",
    whatIf: "அனுமான உருவகப்படுத்துதல்",
    outbreakProb: "நோய் பரவல் சாத்தியக்கூறு",
    anomalies: "முரண்பாடுகள் கண்டறிதல்",
    analytics: "AI பகுப்பாய்வு",
    heatmap: "வெப்ப வரைபடம்",
    timeline: "காலவரிசை இயக்கம்",
    correlations: "தொடர்பு அணி",
    ranking: "மாவட்ட தரவரிசை",
    compare: "மாவட்ட ஒப்பீடு",
    reports: "அறிக்கைகள்",
    voiceAlerts: "குரல் எச்சரிக்கை",
    smsAlerts: "எஸ்.எம்.எஸ் எச்சரிக்கை",
    whatsappBot: "வாட்ஸ்அப் பாட்",
    emailScheduler: "மின்னஞ்சல் திட்டம்",
    citizenReport: "பொதுமக்கள் அறிக்கை",
    resources: "வள ஒதுக்கீடு",
    hospitals: "மருத்துவமனைகள்",
    budget: "நிதி மதிப்பீடு",
    publicDashboard: "பொது பார்வை",
    prevention: "தடுப்பு முறைகள்",
    modelVersions: "மாதிரி பதிப்புகள்",
    apiMonitor: "API கண்காணிப்பு",
    audit: "தணிக்கை பதிவு",
    settings: "அமைப்புகள்",
    deploy: "டாக்கர் நிறுவல்",
    login: "உள்நுழை",
    logout: "வெளியேறு",
    districtsMonitored: "கண்காணிக்கப்படும் மாவட்டங்கள்",
    highRisk: "அதிதீவிர ஆபத்து",
    mediumRisk: "நடுத்தர ஆபத்து",
    lowRisk: "குறைந்த ஆபத்து",
    modelConfidence: "மாதிரி துல்லியம்",
    activeOutbreaks: "செயலில் உள்ள பரவல்கள்",
    sevenDayCases: "7 நாள் பாதிப்புகள்",
    viewDetails: "விவரங்களை காண்க",
    exportCsv: "CSV பதிவிறக்கு",
    liveTelemetry: "நேரலை கண்காணிப்பு இயங்குகிறது",
    dengue: "டெங்கு",
    cholera: "காலரா",
    malaria: "மலேரியா",
    vaccination: "தடுப்பூசி கண்காணிப்பு",
    contactTracing: "தொடர்பு கண்டறிதல்",
    waterQuality: "நீர் தரம் கண்காணிப்பு",
    mosquitoDensity: "கொசு அடர்த்தி குறியீடு",
    epidemicSim: "தொற்றுநோய் உருவகம்",
    notifications: "அறிவிப்புகள்",
    dataExport: "தரவு ஏற்றுமதி",
    help: "உதவி & ஆவணங்கள்",
    aadhaarVerify: "ஆதார் சரிபார்ப்பு",
    ihipIntegration: "IHIP ஒருங்கிணைப்பு",
    autoRetrain: "தானியங்கி மறு பயிற்சி",
    offlinePwa: "ஆஃப்லைன் பயன்முறை"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('vyaadhi_lang') || 'en';
  });

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ta' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('vyaadhi_lang', nextLang);
  };

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isTamil: language === 'ta' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
