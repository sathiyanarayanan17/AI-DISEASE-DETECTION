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
  }
};
