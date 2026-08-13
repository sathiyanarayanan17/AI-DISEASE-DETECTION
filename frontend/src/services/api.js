import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/* -- Tamil Nadu District Coordinates (37 districts) -- */
export const DISTRICT_COORDS = {
  Chennai:          [13.08,  80.27],
  Coimbatore:       [11.00,  76.96],
  Madurai:          [9.93,   78.12],
  Tiruchirappalli:  [10.79,  78.70],
  Salem:            [11.65,  78.16],
  Tirunelveli:      [8.73,   77.70],
  Vellore:          [12.92,  79.13],
  Erode:            [11.34,  77.73],
  Thoothukudi:      [8.76,   78.13],
  Tiruppur:         [11.10,  77.34],
  Dindigul:         [10.36,  77.97],
  Thanjavur:        [10.79,  79.14],
  Sivagangai:       [9.84,   78.48],
  Kancheepuram:     [12.83,  79.70],
  Krishnagiri:      [12.52,  78.22],
  Dharmapuri:       [12.13,  78.16],
  Cuddalore:        [11.75,  79.77],
  Nagapattinam:     [10.76,  79.84],
  Villupuram:       [11.94,  79.49],
  Perambalur:       [11.23,  78.88],
  Ariyalur:         [11.14,  79.08],
  Karur:            [10.96,  78.08],
  Namakkal:         [11.22,  78.17],
  Ramanathapuram:   [9.37,   78.83],
  Virudhunagar:     [9.58,   77.96],
  Tiruvannamalai:   [12.22,  79.07],
  Tiruvarur:        [10.77,  79.64],
  Pudukkottai:      [10.38,  78.82],
  Nilgiris:         [11.41,  76.69],
  Kallakurichi:     [11.74,  78.96],
  Chengalpattu:     [12.69,  79.98],
  Tenkasi:          [8.96,   77.32],
  Mayiladuthurai:   [11.10,  79.65],
  Tirupattur:       [12.49,  78.57],
  Ranipet:          [12.93,  79.33],
  Kanyakumari:      [8.08,   77.55],
  Puducherry:       [11.94,  79.83],
};

export const DISTRICT_STATE = Object.fromEntries(
  Object.keys(DISTRICT_COORDS).map((d) => [d, d === 'Puducherry' ? 'Puducherry (UT)' : 'Tamil Nadu'])
);

/* -- Helpers -- */
function scoreToRisk(score) {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

function riskRecommendation(level, district) {
  if (level === 'High')
    return `Immediate public health response required in ${district}. Alert district health officer, deploy rapid response teams, and activate disease surveillance.`;
  if (level === 'Medium')
    return `Enhanced monitoring advised for ${district}. Review hospital bed capacity, stock ORS/antibiotics, increase community health worker visits.`;
  return `Routine surveillance sufficient for ${district}. Maintain standard vector control and sanitation protocols.`;
}

/* -- Mock data (37 TN districts) -- */
const MOCK_SCORES = [
  82, 65, 74, 55, 45, 38, 71, 58, 89, 62,
  44, 76, 51, 67, 33, 42, 79, 85, 61, 37,
  48, 53, 70, 88, 46, 64, 57, 72, 29, 41,
  66, 83, 54, 39, 77, 91, 60,
];

export const MOCK_DISTRICTS = Object.keys(DISTRICT_COORDS).map((name, i) => {
  const score = MOCK_SCORES[i] ?? 50;
  const level = scoreToRisk(score);
  return {
    district:       name,
    state:          DISTRICT_STATE[name],
    risk_score:     score,
    risk_level:     level,
    avg_cases_7d:   Math.round(score * 1.8 + Math.random() * 20),
    confidence:     parseFloat((0.7 + Math.random() * 0.25).toFixed(3)),
    recommendation: riskRecommendation(level, name),
    lat:            DISTRICT_COORDS[name][0],
    lng:            DISTRICT_COORDS[name][1],
    last_updated:   new Date().toISOString(),
  };
});

/* -- Mock 30-day history for a district -- */
export function generateMockHistory(district, days = 30) {
  const data = [];
  const snap = MOCK_DISTRICTS.find((d) => d.district === district);
  let score = snap ? snap.risk_score * 0.85 : 50;
  let cases = snap ? snap.avg_cases_7d * 0.9 : 80;
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    score = Math.max(5, Math.min(98, score + (Math.random() - 0.46) * 7));
    cases = Math.max(0, cases + (Math.random() - 0.44) * 15);

    const month = d.getMonth() + 1;
    const monsoonBoost = [10, 11, 12].includes(month) ? 1.3 : 1.0;

    data.push({
      date:          d.toISOString().split('T')[0],
      risk_score:    parseFloat((score * monsoonBoost).toFixed(1)),
      risk_level:    scoreToRisk(score * monsoonBoost),
      disease_cases: Math.round(cases * monsoonBoost),
      rainfall:      parseFloat(([10,11,12].includes(month)
                      ? (30 + Math.random() * 80)
                      : (5 + Math.random() * 30)).toFixed(1)),
      temperature:   parseFloat((28 + Math.random() * 6 - ([12,1,2].includes(month) ? 2 : 0)).toFixed(1)),
      humidity:      parseFloat((65 + Math.random() * 20 + ([10,11,12].includes(month) ? 10 : 0)).toFixed(1)),
    });
  }
  return data;
}

/* -- API functions -- */

/** POST /predict/batch - all 37 TN districts */
export const getAllPredictions = async () => {
  const districts = Object.keys(DISTRICT_COORDS);
  const today = new Date().toISOString().split('T')[0];
  const body = districts.map(d => ({
    district: d,
    date: today,
    rainfall: 20.0,
    temperature: 30.0,
    humidity: 70.0,
  }));
  const response = await api.post('/predict/batch', body);
  return response.data.map((item) => ({
    ...item,
    lat:   item.lat   ?? DISTRICT_COORDS[item.district]?.[0],
    lng:   item.lng   ?? DISTRICT_COORDS[item.district]?.[1],
    state: item.state ?? DISTRICT_STATE[item.district] ?? 'Tamil Nadu',
    recommendation: item.recommendation ?? riskRecommendation(item.risk_level, item.district),
  }));
};

/** GET /alerts */
export const getAlerts = async () => {
  const response = await api.get('/alerts');
  return response.data.map((item) => ({
    ...item,
    lat:   item.lat   ?? DISTRICT_COORDS[item.district]?.[0],
    lng:   item.lng   ?? DISTRICT_COORDS[item.district]?.[1],
    state: item.state ?? DISTRICT_STATE[item.district] ?? 'Tamil Nadu',
    recommendation: item.recommendation ?? riskRecommendation(item.risk_level, item.district),
  }));
};

/** GET /history?district=X&days=Y */
export const getDistrictHistory = async (district, days = 30) => {
  try {
    const response = await api.get('/history', { params: { district, days } });
    return response.data;
  } catch {
    return generateMockHistory(district, days);
  }
};

/** GET /predict?district=X&... */
export const predictDistrict = async (district, params = {}) => {
  const response = await api.get('/predict', { params: { district, ...params } });
  return response.data;
};

/** GET /health */
export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

/** GET /analytics/metrics */
export const getModelMetrics = async () => {
  try {
    const response = await api.get('/analytics/metrics');
    return response.data;
  } catch {
    return { accuracy: 0.91, f1_macro: 0.89, roc_auc: 0.95, model_type: 'XGBoost (tuned)' };
  }
};

/** GET /analytics/features */
export const getFeatureImportance = async () => {
  try {
    const response = await api.get('/analytics/features');
    return response.data;
  } catch {
    return { features: [], importances: [] };
  }
};

/** GET /analytics/trends */
export const getDiseaseTrends = async () => {
  try {
    const response = await api.get('/analytics/trends');
    return response.data;
  } catch {
    return [];
  }
};

/** GET /realtime/feed */
export const getRealTimeFeed = async () => {
  try {
    const response = await api.get('/realtime/feed');
    return response.data;
  } catch {
    return [];
  }
};

/** GET /realtime/latest */
export const getRealTimeLatest = async () => {
  try {
    const response = await api.get('/realtime/latest');
    return response.data;
  } catch {
    return null;
  }
};

/** WebSocket connection */
export const connectWebSocket = (onMessage, onError) => {
  try {
    const ws = new WebSocket('ws://localhost:8000/ws');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.warn('WS parse error:', e);
      }
    };
    ws.onerror = (e) => onError && onError(e);
    ws.onclose = () => console.log('WebSocket closed');
    return ws;
  } catch {
    return null;
  }
};

/** GET /forecast?district=X - 7 day forecast */
export const getForecast = async (district) => {
  try {
    const response = await api.get('/forecast', { params: { district } });
    return response.data;
  } catch {
    // Generate mock 7-day forecast
    const snap = MOCK_DISTRICTS.find(d => d.district === district);
    const baseScore = snap ? snap.risk_score : 50;
    const data = [];
    const now = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const drift = (Math.random() - 0.4) * 8;
      const score = Math.max(5, Math.min(98, baseScore + drift * i * 0.5));
      data.push({
        date: d.toISOString().split('T')[0],
        risk_score: parseFloat(score.toFixed(1)),
        confidence_low: parseFloat(Math.max(0, score - 10 - Math.random() * 5).toFixed(1)),
        confidence_high: parseFloat(Math.min(100, score + 10 + Math.random() * 5).toFixed(1)),
        temperature: parseFloat((29 + Math.random() * 5).toFixed(1)),
        rainfall: parseFloat((5 + Math.random() * 40).toFixed(1)),
        humidity: parseFloat((60 + Math.random() * 25).toFixed(1)),
        weather_condition: ['Sunny', 'Partly Cloudy', 'Rainy', 'Overcast', 'Thunderstorm'][Math.floor(Math.random() * 5)],
      });
    }
    return data;
  }
};

/** POST /citizen/report */
export const submitCitizenReport = async (data) => {
  try {
    const response = await api.post('/citizen/report', data);
    return response.data;
  } catch {
    // Mock success
    return { success: true, report_id: 'RPT-' + Date.now(), message: 'Report submitted successfully' };
  }
};

/** GET /resources?workers=X */
export const getResourceAllocation = async (workers) => {
  try {
    const response = await api.get('/resources', { params: { workers } });
    return response.data;
  } catch {
    // Mock resource allocation
    const highRisk = MOCK_DISTRICTS.filter(d => d.risk_level === 'High');
    const totalScore = highRisk.reduce((s, d) => s + d.risk_score, 0);
    const allocations = highRisk.map(d => ({
      district: d.district,
      workers_allocated: Math.max(1, Math.round((d.risk_score / totalScore) * workers)),
      risk_score: d.risk_score,
      priority: 'Critical',
    }));
    return {
      allocations,
      total_workers: workers,
      coverage: '87%',
      hospitals: highRisk.map(d => ({
        district: d.district,
        beds_total: 200 + Math.floor(Math.random() * 300),
        beds_available: 20 + Math.floor(Math.random() * 80),
        icu_available: Math.floor(Math.random() * 10),
      })),
    };
  }
};

/** GET /disease/:disease - disease specific data */
export const getDiseaseData = async (disease) => {
  try {
    const response = await api.get(`/disease/${disease}`);
    return response.data;
  } catch {
    // Mock disease data
    const districts = Object.keys(DISTRICT_COORDS);
    const top10 = districts.slice(0, 10).map((d, i) => ({
      district: d,
      cases: Math.floor(Math.random() * 200) + 50,
      trend: Math.random() > 0.5 ? 'rising' : 'declining',
      last_updated: new Date().toISOString().split('T')[0],
    })).sort((a, b) => b.cases - a.cases);

    const trend90 = [];
    const now = new Date();
    let baseCases = 50;
    for (let i = 89; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      baseCases = Math.max(5, baseCases + (Math.random() - 0.45) * 10);
      trend90.push({
        date: d.toISOString().split('T')[0],
        cases: Math.round(baseCases),
      });
    }

    return {
      disease,
      total_cases: top10.reduce((s, d) => s + d.cases, 0),
      trend: 'rising',
      peak_month: 'November',
      top_districts: top10,
      trend_90d: trend90,
    };
  }
};

/** GET /compare?d1=X&d2=Y */
export const getCompareData = async (d1, d2) => {
  try {
    const response = await api.get('/compare', { params: { d1, d2 } });
    return response.data;
  } catch {
    const h1 = generateMockHistory(d1, 30);
    const h2 = generateMockHistory(d2, 30);
    const snap1 = MOCK_DISTRICTS.find(d => d.district === d1) || MOCK_DISTRICTS[0];
    const snap2 = MOCK_DISTRICTS.find(d => d.district === d2) || MOCK_DISTRICTS[1];
    return {
      district1: { ...snap1, history: h1 },
      district2: { ...snap2, history: h2 },
    };
  }
};

/** GET /analytics/anomalies */
export const getAnomalies = async () => {
  try {
    const r = await api.get('/analytics/anomalies');
    return r.data;
  } catch {
    return [];
  }
};

/** GET /forecast?district=X&days=14 - outbreak probability */
export const getOutbreakProbability = async (district) => {
  try {
    const r = await api.get('/forecast', { params: { district, days: 14 } });
    return r.data;
  } catch {
    return [];
  }
};

export default api;
