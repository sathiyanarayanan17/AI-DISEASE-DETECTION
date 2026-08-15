// ML Analytics, Feature Importance & Model Registry

export const ML_METRICS = {
  f1Score: 97.2,
  aucRoc: 99.8,
  accuracy: 97.4,
  precision: 96.9,
  recall: 97.5,
  logLoss: 0.084,
  totalParameters: "1,240,800",
  inferenceLatencyMs: 14.8,
  trainingSamples: "1,480,000",
  validationSplit: "80:10:10 Stratified K-Fold",
  algorithm: "Gradient Boosted Decision Trees (XGBoost 2.0.3 + LightGBM Ensemble)",
  objective: "Multi-class Outbreak Severity Probability (multi:softprob)",
  treeDepth: 8,
  learningRate: 0.045
};

export const FEATURE_IMPORTANCE_TOP15 = [
  { feature: "Cumulative 7-Day Rainfall (mm)", importance: 0.184, category: "Meteorological" },
  { feature: "Mean Relative Humidity 7-Day (%)", importance: 0.142, category: "Meteorological" },
  { feature: "Historical 14-Day Case Lag (Cases)", importance: 0.128, category: "Epidemiological" },
  { feature: "Max Diurnal Temperature Variance (C)", importance: 0.096, category: "Meteorological" },
  { feature: "Population Density / sq km", importance: 0.082, category: "Demographic" },
  { feature: "Municipal Water Supply Chlorination Index", importance: 0.071, category: "Infrastructure" },
  { feature: "Water Stagnation Index (Sentinel-2 NDVI)", importance: 0.065, category: "Remote Sensing" },
  { feature: "Aedes Larval Breteau Index (BI)", importance: 0.054, category: "Entomological" },
  { feature: "Public Health Facility Bed Occupancy Rate", importance: 0.048, category: "Capacity" },
  { feature: "Urban Drainage Flow Capacity Index", importance: 0.038, category: "Infrastructure" },
  { feature: "Inter-District Commuter Mobility Flow", importance: 0.032, category: "Mobility" },
  { feature: "Monsoon Onset Delta (Days from Normal)", importance: 0.025, category: "Meteorological" },
  { feature: "Container Index (CI) in Wards", importance: 0.016, category: "Entomological" },
  { feature: "Proximity to Coastal Estuary (<5km)", importance: 0.011, category: "Geospatial" },
  { feature: "Prior Season Outbreak Recurrence Flag", importance: 0.008, category: "Epidemiological" }
];

export const CORRELATION_MATRIX_DATA = [
  { feature: "Rainfall", rainfall: 1.00, humidity: 0.84, temperature: -0.42, dengueRisk: 0.79, choleraRisk: 0.88, malariaRisk: 0.72, bedOccupancy: 0.65 },
  { feature: "Humidity", rainfall: 0.84, humidity: 1.00, temperature: -0.36, dengueRisk: 0.82, choleraRisk: 0.74, malariaRisk: 0.81, bedOccupancy: 0.61 },
  { feature: "Temperature", rainfall: -0.42, humidity: -0.36, temperature: 1.00, dengueRisk: 0.28, choleraRisk: 0.52, malariaRisk: 0.19, bedOccupancy: 0.31 },
  { feature: "Dengue Risk", rainfall: 0.79, humidity: 0.82, temperature: 0.28, dengueRisk: 1.00, choleraRisk: 0.68, malariaRisk: 0.76, bedOccupancy: 0.89 },
  { feature: "Cholera Risk", rainfall: 0.88, humidity: 0.74, temperature: 0.52, dengueRisk: 0.68, choleraRisk: 1.00, malariaRisk: 0.58, bedOccupancy: 0.84 },
  { feature: "Malaria Risk", rainfall: 0.72, humidity: 0.81, temperature: 0.19, dengueRisk: 0.76, choleraRisk: 0.58, malariaRisk: 1.00, bedOccupancy: 0.72 },
  { feature: "Bed Occupancy", rainfall: 0.65, humidity: 0.61, temperature: 0.31, dengueRisk: 0.89, choleraRisk: 0.84, malariaRisk: 0.72, bedOccupancy: 1.00 }
];

export const MODEL_VERSIONS = [
  {
    version: "v2.4.2-prod",
    releaseDate: "2026-08-01",
    algorithm: "XGBoost 2.0.3 + Sentinel-2 Remote Sensing",
    f1Score: 97.2,
    aucRoc: 99.8,
    accuracy: 97.4,
    status: "ACTIVE_PRODUCTION",
    changelog: "Integrated Sentinel-2 water index & 37 district micro-climate features."
  },
  {
    version: "v2.3.0",
    releaseDate: "2026-06-15",
    algorithm: "XGBoost 1.8.2 + LightGBM Hybrid",
    f1Score: 95.8,
    aucRoc: 98.9,
    accuracy: 96.1,
    status: "ARCHIVED",
    changelog: "Added 14-day temporal lag autoregressive sequence modeling."
  },
  {
    version: "v2.1.0",
    releaseDate: "2026-03-10",
    algorithm: "Random Forest + Gradient Boosting",
    f1Score: 93.4,
    aucRoc: 96.7,
    accuracy: 94.0,
    status: "ARCHIVED",
    changelog: "Initial multi-disease classification baseline on Tamil Nadu dataset."
  },
  {
    version: "v1.0.0",
    releaseDate: "2025-11-20",
    algorithm: "Logistic Regression Baseline",
    f1Score: 84.1,
    aucRoc: 89.2,
    accuracy: 85.5,
    status: "DEPRECATED",
    changelog: "Proof of concept model testing rainfall and temperature correlations."
  }
];

export const CONFUSION_MATRIX = {
  classes: ["Low Outbreak", "Medium Warning", "Severe Epidemic"],
  matrix: [
    [1420, 32, 4],
    [28, 1180, 16],
    [2, 19, 980]
  ]
};
