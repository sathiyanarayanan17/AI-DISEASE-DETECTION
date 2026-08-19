import axios from 'axios';
import { DISTRICTS_DATA, getDistrictByName, getHighRiskDistricts } from '../data/districtsData';
import { DISEASE_DATA, getDiseaseData } from '../data/diseaseData';
import { ML_METRICS, FEATURE_IMPORTANCE_TOP15 } from '../data/mlAnalyticsData';
import { HOSPITALS_DATA } from '../data/hospitalsData';

const BASE_URL = 'http://localhost:8000';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Citizen reports storage
let citizenReports = [
  {
    id: "CIT-901",
    name: "Murugan K.",
    district: "Chennai",
    contact: "+91 98401 23456",
    symptoms: ["High Fever", "Joint Pain", "Headache"],
    onsetDate: "2026-08-13",
    timestamp: "2026-08-14 18:20",
    status: "UNDER_REVIEW"
  },
  {
    id: "CIT-902",
    name: "Revathi S.",
    district: "Madurai",
    contact: "+91 94432 87654",
    symptoms: ["Vomiting", "Severe Diarrhea"],
    onsetDate: "2026-08-14",
    timestamp: "2026-08-15 08:10",
    status: "INVESTIGATING"
  }
];

export const api = {
  // 1. Single District Prediction / Simulation
  predict: async (params) => {
    try {
      const res = await client.get('/predict', { params });
      return res.data;
    } catch (err) {
      // Mock Fallback
      const district = getDistrictByName(params?.district || "Chennai");
      const rainfall = parseFloat(params?.rainfall ?? district.weather.rainfall);
      const temp = parseFloat(params?.temperature ?? district.weather.temperature);
      const humidity = parseFloat(params?.humidity ?? district.weather.humidity);

      // Simple XGBoost-like response formula
      const calculatedRisk = Math.min(
        100,
        Math.max(
          10,
          Math.round((rainfall * 0.45) + (humidity * 0.35) + (temp > 30 ? (temp - 30) * 2 : 0) + 12)
        )
      );

      const riskLevel = calculatedRisk >= 70 ? 'high' : (calculatedRisk >= 40 ? 'medium' : 'low');

      return {
        district: district.name,
        riskScore: calculatedRisk,
        riskLevel,
        confidence: 97.4,
        probabilities: {
          dengue: Math.round(calculatedRisk * 0.58),
          cholera: Math.round(calculatedRisk * 0.28),
          malaria: Math.round(calculatedRisk * 0.14)
        },
        recommendation: district.recommendation,
        contributingFactors: [
          { factor: "Rainfall Index", weight: `${Math.round(rainfall * 0.8)}%` },
          { factor: "Relative Humidity", weight: `${Math.round(humidity * 0.6)}%` },
          { factor: "Ambient Temperature", weight: `${Math.round(temp * 0.5)}%` }
        ]
      };
    }
  },

  // 2. Batch District Predictions
  predictBatch: async () => {
    try {
      const res = await client.post('/predict/batch', DISTRICTS_DATA);
      return res.data;
    } catch (err) {
      return DISTRICTS_DATA.map((d) => ({
        id: d.id,
        name: d.name,
        riskScore: d.riskScore,
        riskLevel: d.riskLevel,
        confidence: d.confidence,
        totalCases7d: d.totalCases7d,
        weather: d.weather
      }));
    }
  },

  // 3. Alerts
  getAlerts: async () => {
    try {
      const res = await client.get('/alerts');
      return res.data;
    } catch (err) {
      return DISTRICTS_DATA.filter((d) => d.riskLevel !== 'low').map((d, i) => ({
        id: `ALT-${2000 + i}`,
        district: d.name,
        riskScore: d.riskScore,
        riskLevel: d.riskLevel,
        recommendation: d.recommendation,
        timestamp: "Live",
        confidence: d.confidence
      }));
    }
  },

  // 4. District Historical 30-Day
  getDistrictHistory: async (districtName, days = 30) => {
    try {
      const res = await client.get(`/history?district=${encodeURIComponent(districtName)}&days=${days}`);
      return res.data;
    } catch (err) {
      const district = getDistrictByName(districtName);
      return district.history30d.slice(-days);
    }
  },

  // 5. AI Analytics
  getAnalyticsMetrics: async () => {
    try {
      const res = await client.get('/analytics/metrics');
      return res.data;
    } catch (err) {
      return ML_METRICS;
    }
  },

  getAnalyticsFeatures: async () => {
    try {
      const res = await client.get('/analytics/features');
      return res.data;
    } catch (err) {
      return FEATURE_IMPORTANCE_TOP15;
    }
  },

  // 6. 7-Day Forecast
  getForecast: async (districtName, days = 7) => {
    try {
      const res = await client.get(`/forecast?district=${encodeURIComponent(districtName)}&days=${days}`);
      return res.data;
    } catch (err) {
      const district = getDistrictByName(districtName);
      const forecastDays = [];
      const today = new Date();

      for (let i = 1; i <= days; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
        
        const delta = Math.sin(i / 1.5) * 6;
        const predictedScore = Math.min(100, Math.max(10, Math.round(district.riskScore + delta)));
        const rain = Math.max(0, Math.round((district.weather.rainfall + Math.cos(i) * 5) * 10) / 10);
        const temp = Math.round((district.weather.temperature + (Math.sin(i) * 1.5)) * 10) / 10;
        const hum = Math.min(95, Math.max(40, Math.round(district.weather.humidity + (delta * 0.7))));

        forecastDays.push({
          day: dayName,
          date: dateStr,
          riskScore: predictedScore,
          lowerBound: Math.max(0, predictedScore - 7),
          upperBound: Math.min(100, predictedScore + 7),
          rainfall: rain,
          temperature: temp,
          humidity: hum,
          outbreakProbability: Math.min(99, Math.round(predictedScore * 0.95))
        });
      }

      return {
        district: district.name,
        currentScore: district.riskScore,
        forecast: forecastDays
      };
    }
  },

  // 7. Disease Profile & 90-Day Trend
  getDiseaseData: async (diseaseName) => {
    try {
      const res = await client.get(`/disease/${diseaseName}?days=90`);
      return res.data;
    } catch (err) {
      return getDiseaseData(diseaseName);
    }
  },

  // 8. Citizen Reports
  submitCitizenReport: async (reportData) => {
    try {
      const res = await client.post('/citizen/report', reportData);
      return res.data;
    } catch (err) {
      const newEntry = {
        id: `CIT-${Date.now().toString().slice(-4)}`,
        ...reportData,
        timestamp: new Date().toLocaleString(),
        status: "SUBMITTED"
      };
      citizenReports.unshift(newEntry);
      return { success: true, report: newEntry };
    }
  },

  getCitizenReports: async () => {
    try {
      const res = await client.get('/citizen/reports');
      return res.data;
    } catch (err) {
      return citizenReports;
    }
  },

  // 9. Resource Allocation
  allocateResources: async (workersCount = 100) => {
    try {
      const res = await client.get(`/resources/allocate?workers=${workersCount}`);
      return res.data;
    } catch (err) {
      const highDistricts = getHighRiskDistricts();
      const totalHighRiskScore = highDistricts.reduce((acc, d) => acc + d.riskScore, 0);

      const allocation = highDistricts.map((d) => {
        const assignedWorkers = Math.round((d.riskScore / totalHighRiskScore) * workersCount);
        return {
          district: d.name,
          riskScore: d.riskScore,
          recommendedWorkers: Math.max(5, assignedWorkers),
          priority: d.riskScore > 80 ? "Critical P1" : "Urgent P2",
          keyFocus: d.riskScore > 80 ? "Indoor Fogging & Rapid Tests" : "Larvicide & Water Chlorination"
        };
      });

      return {
        totalWorkers: workersCount,
        allocation,
        hospitals: HOSPITALS_DATA
      };
    }
  },

  // 10. Hospitals
  getHospitals: async () => {
    try {
      const res = await client.get('/resources/hospitals');
      return res.data;
    } catch (err) {
      return HOSPITALS_DATA;
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // 11. VACCINATION TRACKER
  // ═══════════════════════════════════════════════════════════════════
  getVaccinationStats: async () => {
    try {
      const res = await client.get('/vaccination/stats');
      return res.data;
    } catch (err) {
      return {
        total_vaccinated: 5261432,
        coverage_percent: 77.2,
        pending: 1553568,
        doses_today: 34521,
        total_population: 6815000
      };
    }
  },

  getVaccinationSchedule: async () => {
    try {
      const res = await client.get('/vaccination/schedule');
      return res.data;
    } catch (err) {
      return [
        { id: 1, district: 'Chennai', location: 'GH Egmore', date: '2026-08-20', vaccine_type: 'Covishield', slots_total: 200, slots_booked: 156, status: 'Open' },
        { id: 2, district: 'Madurai', location: 'Govt Rajaji Hospital', date: '2026-08-21', vaccine_type: 'Covaxin', slots_total: 150, slots_booked: 150, status: 'Full' },
        { id: 3, district: 'Coimbatore', location: 'CMCH PHC', date: '2026-08-22', vaccine_type: 'Covishield', slots_total: 180, slots_booked: 102, status: 'Open' }
      ];
    }
  },

  getVaccinationInventory: async () => {
    try {
      const res = await client.get('/vaccination/inventory');
      return res.data;
    } catch (err) {
      return [
        { vaccine_name: 'Covishield', stock: 124500, threshold: 50000, status: 'Sufficient' },
        { vaccine_name: 'Covaxin', stock: 38200, threshold: 40000, status: 'Low' },
        { vaccine_name: 'Moderna', stock: 12800, threshold: 20000, status: 'Critical' }
      ];
    }
  },

  registerVaccination: async (data) => {
    try {
      const res = await client.post('/vaccination/register', data);
      return res.data;
    } catch (err) {
      return { success: true, registration_id: `VAX-${Date.now().toString().slice(-6)}`, message: 'Registration successful' };
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // 12. WATER QUALITY MONITORING
  // ═══════════════════════════════════════════════════════════════════
  getWaterQuality: async () => {
    try {
      const res = await client.get('/water-quality');
      return res.data;
    } catch (err) {
      return [
        { district: 'Chennai', wqi_score: 78, ph: 7.2, turbidity: 3.1, dissolved_oxygen: 6.8, coliform_count: 120, chlorine_level: 0.4, tds: 380, status: 'Safe', last_tested: '2026-08-18' },
        { district: 'Madurai', wqi_score: 52, ph: 6.4, turbidity: 8.2, dissolved_oxygen: 4.2, coliform_count: 580, chlorine_level: 0.1, tds: 720, status: 'Unsafe', last_tested: '2026-08-17' },
        { district: 'Coimbatore', wqi_score: 82, ph: 7.0, turbidity: 2.5, dissolved_oxygen: 7.1, coliform_count: 80, chlorine_level: 0.5, tds: 320, status: 'Safe', last_tested: '2026-08-18' }
      ];
    }
  },

  getWaterQualityAlerts: async () => {
    try {
      const res = await client.get('/water-quality/alerts');
      return res.data;
    } catch (err) {
      return [
        { district: 'Madurai', parameters_violated: ['Coliform', 'Turbidity'], severity: 'Critical' },
        { district: 'Salem', parameters_violated: ['TDS', 'Chlorine'], severity: 'Warning' }
      ];
    }
  },

  getWaterQualityTrends: async (district = 'Chennai', days = 30) => {
    try {
      const res = await client.get(`/water-quality/trends?district=${encodeURIComponent(district)}&days=${days}`);
      return res.data;
    } catch (err) {
      const trends = [];
      for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (days - i));
        trends.push({
          date: d.toISOString().split('T')[0],
          coliform: Math.round(100 + Math.random() * 200),
          turbidity: Math.round((2 + Math.random() * 5) * 10) / 10,
          tds: Math.round(300 + Math.random() * 200)
        });
      }
      return trends;
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // 13. MOSQUITO DENSITY INDEX
  // ═══════════════════════════════════════════════════════════════════
  getMosquitoDensity: async () => {
    try {
      const res = await client.get('/mosquito');
      return res.data;
    } catch (err) {
      return [
        { district: 'Chennai', breteau_index: 28, house_index: 15, container_index: 22, larval_density: 3.2, risk_level: 'High', last_surveyed: '2026-08-18' },
        { district: 'Coimbatore', breteau_index: 18, house_index: 10, container_index: 14, larval_density: 2.1, risk_level: 'Medium', last_surveyed: '2026-08-17' },
        { district: 'Salem', breteau_index: 8, house_index: 5, container_index: 7, larval_density: 1.0, risk_level: 'Low', last_surveyed: '2026-08-18' }
      ];
    }
  },

  getMosquitoTrends: async (district = 'Chennai', days = 30) => {
    try {
      const res = await client.get(`/mosquito/trends?district=${encodeURIComponent(district)}&days=${days}`);
      return res.data;
    } catch (err) {
      const trends = [];
      for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (days - i));
        trends.push({
          date: d.toISOString().split('T')[0],
          breteau_index: Math.round(10 + Math.random() * 20),
          house_index: Math.round(5 + Math.random() * 12)
        });
      }
      return trends;
    }
  },

  getMosquitoFogging: async () => {
    try {
      const res = await client.get('/mosquito/fogging');
      return res.data;
    } catch (err) {
      return [
        { date: '2026-08-19', district: 'Chennai', area_sqkm: 12.5, teams_deployed: 8, status: 'In Progress' },
        { date: '2026-08-18', district: 'Madurai', area_sqkm: 8.2, teams_deployed: 5, status: 'Completed' },
        { date: '2026-08-18', district: 'Coimbatore', area_sqkm: 6.8, teams_deployed: 4, status: 'Completed' }
      ];
    }
  },

  getMosquitoStats: async () => {
    try {
      const res = await client.get('/mosquito/stats');
      return res.data;
    } catch (err) {
      return { districts_surveyed: 15, avg_breteau_index: 16.4, high_density_zones: 6, fogging_operations_today: 4 };
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // 14. NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════
  getNotifications: async () => {
    try {
      const res = await client.get('/notifications');
      return res.data;
    } catch (err) {
      return [];
    }
  },

  getUnreadNotifications: async () => {
    try {
      const res = await client.get('/notifications/unread');
      return res.data;
    } catch (err) {
      return { count: 0, notifications: [] };
    }
  },

  markNotificationRead: async (id) => {
    try {
      const res = await client.post('/notifications/mark-read', { id });
      return res.data;
    } catch (err) {
      return { success: true };
    }
  },

  markAllNotificationsRead: async () => {
    try {
      const res = await client.post('/notifications/mark-all-read');
      return res.data;
    } catch (err) {
      return { success: true };
    }
  },

  getNotificationPreferences: async () => {
    try {
      const res = await client.get('/notifications/preferences');
      return res.data;
    } catch (err) {
      return {
        critical: { email: true, sms: true, push: true, voice: true },
        warning: { email: true, sms: true, push: true, voice: false },
        info: { email: true, sms: false, push: true, voice: false }
      };
    }
  },

  updateNotificationPreferences: async (prefs) => {
    try {
      const res = await client.post('/notifications/preferences', prefs);
      return res.data;
    } catch (err) {
      return { success: true };
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // 15. HEALTH CHECK & SYSTEM STATUS
  // ═══════════════════════════════════════════════════════════════════
  getHealthStatus: async () => {
    try {
      const res = await client.get('/health');
      return res.data;
    } catch (err) {
      return { status: 'offline', model_loaded: false, active_connections: 0 };
    }
  }
};
