import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

// ═══════════════════════════════════════════════════════════════════
// 82 DEDICATED PAGES — World's Most Comprehensive Disease Surveillance App
// ═══════════════════════════════════════════════════════════════════

// Landing
import LandingPage from './pages/LandingPage';

// Core Monitoring
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import DistrictDetailPage from './pages/DistrictDetailPage';
import DiseaseTrackerPage from './pages/DiseaseTrackerPage';
import CustomDashboardPage from './pages/CustomDashboardPage';

// AI Predictive Tools
import AnalyticsPage from './pages/AnalyticsPage';
import RealtimePage from './pages/RealtimePage';
import ForecastPage from './pages/ForecastPage';
import WhatIfPage from './pages/WhatIfPage';
import OutbreakProbPage from './pages/OutbreakProbPage';
import AnomalyPage from './pages/AnomalyPage';
import OutbreakChainPage from './pages/OutbreakChainPage';
import TriagePage from './pages/TriagePage';
import SatellitePage from './pages/SatellitePage';
import GeneticDriftPage from './pages/GeneticDriftPage';
import EpidemicSimulatorPage from './pages/EpidemicSimulatorPage';
import LSTMForecastPage from './pages/LSTMForecastPage';
import R0CalculatorPage from './pages/R0CalculatorPage';

// Advanced AI Features (NEW)
import VoiceCommandPage from './pages/VoiceCommandPage';
import NLPSymptomPage from './pages/NLPSymptomPage';
import CausalInferencePage from './pages/CausalInferencePage';
import MultiAgentSimPage from './pages/MultiAgentSimPage';
import SmartAlertSchedulePage from './pages/SmartAlertSchedulePage';
import BreedingSiteAIPage from './pages/BreedingSiteAIPage';
import SmartNotifPriorityPage from './pages/SmartNotifPriorityPage';
import DataQualityPage from './pages/DataQualityPage';
import PredictionConfidencePage from './pages/PredictionConfidencePage';
import AnomalyExplainPage from './pages/AnomalyExplainPage';
import RLResourcePage from './pages/RLResourcePage';
import AutoEpiSummaryPage from './pages/AutoEpiSummaryPage';

// Advanced Analytics & ML
import SpatialClusterPage from './pages/SpatialClusterPage';
import NetworkAnalysisPage from './pages/NetworkAnalysisPage';
import SurvivalAnalysisPage from './pages/SurvivalAnalysisPage';
import SocialMediaPage from './pages/SocialMediaPage';
import SymptomHeatmapPage from './pages/SymptomHeatmapPage';
import PharmacySalesPage from './pages/PharmacySalesPage';
import BayesianNowcastPage from './pages/BayesianNowcastPage';
import CounterfactualPage from './pages/CounterfactualPage';
import ABTestingPage from './pages/ABTestingPage';
import AnomalyIsolationPage from './pages/AnomalyIsolationPage';
import FederatedLearningPage from './pages/FederatedLearningPage';
import TransferLearningPage from './pages/TransferLearningPage';
import ModelDriftPage from './pages/ModelDriftPage';
import BenchmarkingPage from './pages/BenchmarkingPage';

// Visualizations
import HeatmapCalendarPage from './pages/HeatmapCalendarPage';
import TimelinePlaybackPage from './pages/TimelinePlaybackPage';
import CorrelationPage from './pages/CorrelationPage';
import DistrictRankingPage from './pages/DistrictRankingPage';
import ComparePage from './pages/ComparePage';

// Communications & Alerts
import ReportsPage from './pages/ReportsPage';
import PDFReportPage from './pages/PDFReportPage';
import VoiceAlertsPage from './pages/VoiceAlertsPage';
import SmsAlertsPage from './pages/SmsAlertsPage';
import WhatsappBotPage from './pages/WhatsappBotPage';
import EmailSchedulerPage from './pages/EmailSchedulerPage';
import NotificationsPage from './pages/NotificationsPage';
import GeoFencingPage from './pages/GeoFencingPage';

// Health Operations
import CitizenReportPage from './pages/CitizenReportPage';
import ResourceAllocPage from './pages/ResourceAllocPage';
import HospitalsPage from './pages/HospitalsPage';
import BudgetEstimatorPage from './pages/BudgetEstimatorPage';
import VaccinationTrackerPage from './pages/VaccinationTrackerPage';
import ContactTracingPage from './pages/ContactTracingPage';
import WaterQualityPage from './pages/WaterQualityPage';
import MosquitoDensityPage from './pages/MosquitoDensityPage';
import SupplyChainPage from './pages/SupplyChainPage';
import FieldWorkerPage from './pages/FieldWorkerPage';
import TelemedicinePage from './pages/TelemedicinePage';
import MortalityTrackerPage from './pages/MortalityTrackerPage';
import GenomicSurveillancePage from './pages/GenomicSurveillancePage';
import DroneSurveillancePage from './pages/DroneSurveillancePage';

// System & Governance
import PublicDashboardPage from './pages/PublicDashboardPage';
import PreventionTipsPage from './pages/PreventionTipsPage';
import ModelVersionsPage from './pages/ModelVersionsPage';
import ApiMonitorPage from './pages/ApiMonitorPage';
import AuditTrailPage from './pages/AuditTrailPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import DockerDeployPage from './pages/DockerDeployPage';
import DataExportPage from './pages/DataExportPage';
import HelpDocsPage from './pages/HelpDocsPage';
import KPIScorecardPage from './pages/KPIScorecardPage';
import JWTAuthPage from './pages/JWTAuthPage';
import RateLimitingPage from './pages/RateLimitingPage';

// Integration & Identity
import AadhaarVerifyPage from './pages/AadhaarVerifyPage';
import AutoRetrainPage from './pages/AutoRetrainPage';
import IHIPIntegrationPage from './pages/IHIPIntegrationPage';
import OfflinePWAPage from './pages/OfflinePWAPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppLayout />}>
        {/* Core Monitoring */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/custom-dashboard" element={<CustomDashboardPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/district/:name" element={<DistrictDetailPage />} />
        <Route path="/disease/:disease" element={<DiseaseTrackerPage />} />

        {/* AI Predictive Tools */}
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/realtime" element={<RealtimePage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/lstm-forecast" element={<LSTMForecastPage />} />
        <Route path="/what-if" element={<WhatIfPage />} />
        <Route path="/outbreak-probability" element={<OutbreakProbPage />} />
        <Route path="/anomalies" element={<AnomalyPage />} />
        <Route path="/outbreak-chain" element={<OutbreakChainPage />} />
        <Route path="/triage" element={<TriagePage />} />
        <Route path="/satellite" element={<SatellitePage />} />
        <Route path="/genetic-drift" element={<GeneticDriftPage />} />
        <Route path="/epidemic-simulator" element={<EpidemicSimulatorPage />} />
        <Route path="/r0-calculator" element={<R0CalculatorPage />} />

        {/* Advanced AI Features */}
        <Route path="/voice-command" element={<VoiceCommandPage />} />
        <Route path="/nlp-symptoms" element={<NLPSymptomPage />} />
        <Route path="/causal-inference" element={<CausalInferencePage />} />
        <Route path="/multi-agent-sim" element={<MultiAgentSimPage />} />
        <Route path="/smart-alert-schedule" element={<SmartAlertSchedulePage />} />
        <Route path="/breeding-site-ai" element={<BreedingSiteAIPage />} />
        <Route path="/smart-priority" element={<SmartNotifPriorityPage />} />
        <Route path="/data-quality" element={<DataQualityPage />} />
        <Route path="/prediction-confidence" element={<PredictionConfidencePage />} />
        <Route path="/anomaly-explain" element={<AnomalyExplainPage />} />
        <Route path="/rl-resource" element={<RLResourcePage />} />
        <Route path="/auto-epi-summary" element={<AutoEpiSummaryPage />} />

        {/* Advanced Analytics & ML */}
        <Route path="/spatial-clustering" element={<SpatialClusterPage />} />
        <Route path="/network-analysis" element={<NetworkAnalysisPage />} />
        <Route path="/survival-analysis" element={<SurvivalAnalysisPage />} />
        <Route path="/social-media" element={<SocialMediaPage />} />
        <Route path="/symptom-heatmap" element={<SymptomHeatmapPage />} />
        <Route path="/pharmacy-sales" element={<PharmacySalesPage />} />
        <Route path="/bayesian-nowcast" element={<BayesianNowcastPage />} />
        <Route path="/counterfactual" element={<CounterfactualPage />} />
        <Route path="/ab-testing" element={<ABTestingPage />} />
        <Route path="/isolation-forest" element={<AnomalyIsolationPage />} />
        <Route path="/federated-learning" element={<FederatedLearningPage />} />
        <Route path="/transfer-learning" element={<TransferLearningPage />} />
        <Route path="/model-drift" element={<ModelDriftPage />} />
        <Route path="/benchmarking" element={<BenchmarkingPage />} />

        {/* Visualizations */}
        <Route path="/heatmap" element={<HeatmapCalendarPage />} />
        <Route path="/timeline" element={<TimelinePlaybackPage />} />
        <Route path="/correlation" element={<CorrelationPage />} />
        <Route path="/ranking" element={<DistrictRankingPage />} />
        <Route path="/compare" element={<ComparePage />} />

        {/* Communications */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/pdf-reports" element={<PDFReportPage />} />
        <Route path="/voice-alerts" element={<VoiceAlertsPage />} />
        <Route path="/sms-alerts" element={<SmsAlertsPage />} />
        <Route path="/whatsapp" element={<WhatsappBotPage />} />
        <Route path="/email-scheduler" element={<EmailSchedulerPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/geo-fencing" element={<GeoFencingPage />} />

        {/* Health Operations */}
        <Route path="/citizen-report" element={<CitizenReportPage />} />
        <Route path="/resources" element={<ResourceAllocPage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/budget" element={<BudgetEstimatorPage />} />
        <Route path="/vaccination" element={<VaccinationTrackerPage />} />
        <Route path="/contact-tracing" element={<ContactTracingPage />} />
        <Route path="/water-quality" element={<WaterQualityPage />} />
        <Route path="/mosquito-density" element={<MosquitoDensityPage />} />
        <Route path="/supply-chain" element={<SupplyChainPage />} />
        <Route path="/field-workers" element={<FieldWorkerPage />} />
        <Route path="/telemedicine" element={<TelemedicinePage />} />
        <Route path="/mortality" element={<MortalityTrackerPage />} />
        <Route path="/genomic-surveillance" element={<GenomicSurveillancePage />} />
        <Route path="/drone-surveillance" element={<DroneSurveillancePage />} />

        {/* System & Governance */}
        <Route path="/public" element={<PublicDashboardPage />} />
        <Route path="/prevention" element={<PreventionTipsPage />} />
        <Route path="/model-versions" element={<ModelVersionsPage />} />
        <Route path="/auto-retrain" element={<AutoRetrainPage />} />
        <Route path="/api-monitor" element={<ApiMonitorPage />} />
        <Route path="/rate-limiting" element={<RateLimitingPage />} />
        <Route path="/jwt-auth" element={<JWTAuthPage />} />
        <Route path="/audit" element={<AuditTrailPage />} />
        <Route path="/kpi-scorecard" element={<KPIScorecardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/deploy" element={<DockerDeployPage />} />
        <Route path="/data-export" element={<DataExportPage />} />
        <Route path="/help" element={<HelpDocsPage />} />

        {/* Integration */}
        <Route path="/aadhaar-verify" element={<AadhaarVerifyPage />} />
        <Route path="/ihip-integration" element={<IHIPIntegrationPage />} />
        <Route path="/offline-pwa" element={<OfflinePWAPage />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
