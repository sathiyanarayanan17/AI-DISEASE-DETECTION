// Structured Audit Log Records (30+ entries) for Security & Operational Traceability

export const AUDIT_LOGS = [
  {
    id: "AUD-10821",
    timestamp: "2026-08-15 09:12:45",
    actor: "system_xgboost_daemon",
    action: "BATCH_PREDICTION",
    district: "Chennai",
    severity: "HIGH",
    details: "Automated hourly XGBoost risk score inference executed. Score updated to 88/100."
  },
  {
    id: "AUD-10820",
    timestamp: "2026-08-15 09:10:12",
    actor: "dr.kavitha_health_officer",
    action: "ALERT_BROADCAST",
    district: "Chengalpattu",
    severity: "CRITICAL",
    details: "Dispatched Emergency Vector Larvicide Advisory to 42 Primary Health Centers."
  },
  {
    id: "AUD-10819",
    timestamp: "2026-08-15 08:58:30",
    actor: "gateway_msg91_service",
    action: "SMS_DISPATCH",
    district: "Nagapattinam",
    severity: "MEDIUM",
    details: "Dispatched 1,450 coastal hygiene warning SMS alerts to registered community health volunteers."
  },
  {
    id: "AUD-10818",
    timestamp: "2026-08-15 08:45:00",
    actor: "system_weather_sync",
    action: "DATA_INGESTION",
    district: "All Districts",
    severity: "INFO",
    details: "IMD Doppler radar rainfall and temperature dataset successfully synchronized."
  },
  {
    id: "AUD-10817",
    timestamp: "2026-08-15 08:32:19",
    actor: "admin_selvam_tn",
    action: "RESOURCE_REALLOCATION",
    district: "Madurai",
    severity: "HIGH",
    details: "Reallocated 50 mobile health workers from Sivagangai to Madurai Vaigai zone."
  },
  {
    id: "AUD-10816",
    timestamp: "2026-08-15 08:15:40",
    actor: "citizen_portal_api",
    action: "CITIZEN_REPORT",
    district: "Coimbatore",
    severity: "MEDIUM",
    details: "New cluster symptom report registered in Singanallur ward (5 cases high fever)."
  },
  {
    id: "AUD-10815",
    timestamp: "2026-08-15 07:55:10",
    actor: "dr.kavitha_health_officer",
    action: "REPORT_GENERATION",
    district: "Tiruchirappalli",
    severity: "INFO",
    details: "Generated 30-Day Epidemiological Vector Risk PDF for Directorate of Public Health."
  },
  {
    id: "AUD-10814",
    timestamp: "2026-08-15 07:30:22",
    actor: "system_model_eval",
    action: "MODEL_VALIDATION",
    district: "Statewide",
    severity: "INFO",
    details: "XGBoost v2.4.2 nightly validation finished: F1 Score 97.2%, ROC-AUC 99.8%."
  },
  {
    id: "AUD-10813",
    timestamp: "2026-08-15 06:45:11",
    actor: "gateway_email_daemon",
    action: "EMAIL_REPORT",
    district: "Chennai",
    severity: "INFO",
    details: "Automated daily dawn briefing dispatched to health.secretary@tn.gov.in."
  },
  {
    id: "AUD-10812",
    timestamp: "2026-08-15 06:10:04",
    actor: "system_security_auth",
    action: "USER_LOGIN",
    district: "Statewide",
    severity: "INFO",
    details: "Health Officer authenticated from IP 117.218.42.10 via Multi-Factor Token."
  },
  {
    id: "AUD-10811",
    timestamp: "2026-08-14 23:45:00",
    actor: "system_anomaly_detector",
    action: "ANOMALY_FLAGGED",
    district: "Cuddalore",
    severity: "HIGH",
    details: "Statistical spike detected: Dengue suspected cases rose 3.4 standard deviations above baseline."
  },
  {
    id: "AUD-10810",
    timestamp: "2026-08-14 22:20:15",
    actor: "whatsapp_webhook_bot",
    action: "BOT_QUERY",
    district: "Salem",
    severity: "INFO",
    details: "WhatsApp automated advisory query answered for Salem municipal zone 4."
  },
  {
    id: "AUD-10809",
    timestamp: "2026-08-14 21:05:43",
    actor: "dr.arun_officer",
    action: "THRESHOLD_UPDATE",
    district: "Thanjavur",
    severity: "MEDIUM",
    details: "Lowered early warning threshold for Cauvery delta sub-basin to 70 index points."
  },
  {
    id: "AUD-10808",
    timestamp: "2026-08-14 20:12:30",
    actor: "citizen_portal_api",
    action: "CITIZEN_REPORT",
    district: "Chennai",
    severity: "MEDIUM",
    details: "Crowdsourced report submitted: stagnant water in Royapuram ward 48."
  },
  {
    id: "AUD-10807",
    timestamp: "2026-08-14 19:30:00",
    actor: "system_database_backup",
    action: "SYSTEM_BACKUP",
    district: "Statewide",
    severity: "INFO",
    details: "Encrypted snapshot of PostgreSQL telemetry database completed (1.4 GB)."
  },
  {
    id: "AUD-10806",
    timestamp: "2026-08-14 18:40:12",
    actor: "admin_selvam_tn",
    action: "BUDGET_CALCULATION",
    district: "Chennai",
    severity: "INFO",
    details: "Exported emergency containment budget forecast of INR 24.5 Lakhs."
  },
  {
    id: "AUD-10805",
    timestamp: "2026-08-14 17:15:55",
    actor: "speech_tts_engine",
    action: "VOICE_ALERT_PLAYBACK",
    district: "Mayiladuthurai",
    severity: "MEDIUM",
    details: "Audio public health warning generated and broadcast to control room staff."
  },
  {
    id: "AUD-10804",
    timestamp: "2026-08-14 16:22:18",
    actor: "system_xgboost_daemon",
    action: "BATCH_PREDICTION",
    district: "Tiruvarur",
    severity: "HIGH",
    details: "Risk index escalated from 65 to 73 following 36mm heavy agricultural rainfall."
  },
  {
    id: "AUD-10803",
    timestamp: "2026-08-14 15:10:09",
    actor: "dr.kavitha_health_officer",
    action: "ALERT_ACKNOWLEDGE",
    district: "Thoothukudi",
    severity: "INFO",
    details: "Coastal ward risk alert marked as acknowledged and field inspection assigned."
  },
  {
    id: "AUD-10802",
    timestamp: "2026-08-14 14:02:44",
    actor: "system_api_gateway",
    action: "RATE_LIMIT_CHECK",
    district: "Statewide",
    severity: "INFO",
    details: "API gateway handled 14,200 incoming surveillance telemetry requests smoothly."
  },
  {
    id: "AUD-10801",
    timestamp: "2026-08-14 12:45:30",
    actor: "dr.suresh_dph",
    action: "WHAT_IF_SIMULATION",
    district: "Coimbatore",
    severity: "INFO",
    details: "Simulated scenario: 85mm rainfall + 34C temperature on industrial zone."
  },
  {
    id: "AUD-10800",
    timestamp: "2026-08-14 11:30:19",
    actor: "system_hospital_sync",
    action: "BED_CAPACITY_UPDATE",
    district: "Madurai",
    severity: "INFO",
    details: "GRH Madurai ICU bed status synced: 29 beds available out of 280."
  },
  {
    id: "AUD-10799",
    timestamp: "2026-08-14 10:15:02",
    actor: "gateway_msg91_service",
    action: "SMS_DISPATCH",
    district: "Chengalpattu",
    severity: "HIGH",
    details: "Dispatched 850 urgent medical officer circulars regarding dengue admissions."
  },
  {
    id: "AUD-10798",
    timestamp: "2026-08-14 09:00:11",
    actor: "system_cron_daemon",
    action: "SCHEDULED_JOB",
    district: "Statewide",
    severity: "INFO",
    details: "Statewide disease matrix cache refreshed across all 37 district nodes."
  },
  {
    id: "AUD-10797",
    timestamp: "2026-08-14 08:12:40",
    actor: "citizen_portal_api",
    action: "CITIZEN_REPORT",
    district: "Kanyakumari",
    severity: "LOW",
    details: "Mild fever report logged from Nagercoil rural subdivision."
  },
  {
    id: "AUD-10796",
    timestamp: "2026-08-14 07:22:15",
    actor: "admin_selvam_tn",
    action: "CONFIG_CHANGE",
    district: "Statewide",
    severity: "MEDIUM",
    details: "Updated language dictionary strings for Tamil translation matrix."
  },
  {
    id: "AUD-10795",
    timestamp: "2026-08-14 06:10:08",
    actor: "system_xgboost_daemon",
    action: "BATCH_PREDICTION",
    district: "Nilgiris",
    severity: "LOW",
    details: "Low risk verified for hill district (28/100); no vector surge detected."
  },
  {
    id: "AUD-10794",
    timestamp: "2026-08-13 22:50:33",
    actor: "dr.kavitha_health_officer",
    action: "USER_LOGOUT",
    district: "Statewide",
    severity: "INFO",
    details: "Session cleanly terminated."
  },
  {
    id: "AUD-10793",
    timestamp: "2026-08-13 21:18:22",
    actor: "system_security_monitor",
    action: "SECURITY_AUDIT",
    district: "Statewide",
    severity: "INFO",
    details: "Zero unauthorized access attempts detected in last 24 hours."
  },
  {
    id: "AUD-10792",
    timestamp: "2026-08-13 20:00:00",
    actor: "system_realtime_feed",
    action: "WEBSOCKET_HEARTBEAT",
    district: "All Districts",
    severity: "INFO",
    details: "WebSocket telemetry channel verified active with 100% packet delivery."
  }
];
