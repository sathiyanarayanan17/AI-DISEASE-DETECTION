import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

// 33 Dedicated Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import DistrictDetailPage from './pages/DistrictDetailPage';
import DiseaseTrackerPage from './pages/DiseaseTrackerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RealtimePage from './pages/RealtimePage';
import ForecastPage from './pages/ForecastPage';
import WhatIfPage from './pages/WhatIfPage';
import OutbreakProbPage from './pages/OutbreakProbPage';
import AnomalyPage from './pages/AnomalyPage';
import HeatmapCalendarPage from './pages/HeatmapCalendarPage';
import TimelinePlaybackPage from './pages/TimelinePlaybackPage';
import CorrelationPage from './pages/CorrelationPage';
import DistrictRankingPage from './pages/DistrictRankingPage';
import ComparePage from './pages/ComparePage';
import ReportsPage from './pages/ReportsPage';
import VoiceAlertsPage from './pages/VoiceAlertsPage';
import SmsAlertsPage from './pages/SmsAlertsPage';
import WhatsappBotPage from './pages/WhatsappBotPage';
import EmailSchedulerPage from './pages/EmailSchedulerPage';
import CitizenReportPage from './pages/CitizenReportPage';
import ResourceAllocPage from './pages/ResourceAllocPage';
import HospitalsPage from './pages/HospitalsPage';
import BudgetEstimatorPage from './pages/BudgetEstimatorPage';
import PublicDashboardPage from './pages/PublicDashboardPage';
import PreventionTipsPage from './pages/PreventionTipsPage';
import ModelVersionsPage from './pages/ModelVersionsPage';
import ApiMonitorPage from './pages/ApiMonitorPage';
import AuditTrailPage from './pages/AuditTrailPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import DockerDeployPage from './pages/DockerDeployPage';

export const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* 1. Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Main Monitoring */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/district/:name" element={<DistrictDetailPage />} />
        <Route path="/disease/:disease" element={<DiseaseTrackerPage />} />

        {/* 3. AI Predictive Tools */}
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/realtime" element={<RealtimePage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/what-if" element={<WhatIfPage />} />
        <Route path="/outbreak-probability" element={<OutbreakProbPage />} />
        <Route path="/anomalies" element={<AnomalyPage />} />

        {/* 4. Visualizations */}
        <Route path="/heatmap" element={<HeatmapCalendarPage />} />
        <Route path="/timeline" element={<TimelinePlaybackPage />} />
        <Route path="/correlation" element={<CorrelationPage />} />
        <Route path="/ranking" element={<DistrictRankingPage />} />
        <Route path="/compare" element={<ComparePage />} />

        {/* 5. Communications & Operations */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/voice-alerts" element={<VoiceAlertsPage />} />
        <Route path="/sms-alerts" element={<SmsAlertsPage />} />
        <Route path="/whatsapp" element={<WhatsappBotPage />} />
        <Route path="/email-scheduler" element={<EmailSchedulerPage />} />
        <Route path="/citizen-report" element={<CitizenReportPage />} />
        <Route path="/resources" element={<ResourceAllocPage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/budget" element={<BudgetEstimatorPage />} />

        {/* 6. System & Governance */}
        <Route path="/public" element={<PublicDashboardPage />} />
        <Route path="/prevention" element={<PreventionTipsPage />} />
        <Route path="/model-versions" element={<ModelVersionsPage />} />
        <Route path="/api-monitor" element={<ApiMonitorPage />} />
        <Route path="/audit" element={<AuditTrailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/deploy" element={<DockerDeployPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
