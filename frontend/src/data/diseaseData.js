// Disease Epidemiology & Clinical Profiles
// Dengue, Cholera, Malaria Profiles, Symptoms, Prevention, 90-Day Trends

const generate90DayDiseaseTrend = (baseCount, trendType) => {
  const points = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
    
    let multiplier = 1;
    if (trendType === "dengue") {
      multiplier = 0.8 + Math.sin(i / 10) * 0.4 + (90 - i) * 0.005;
    } else if (trendType === "cholera") {
      multiplier = 0.9 + Math.cos(i / 8) * 0.35 + (90 - i) * 0.003;
    } else {
      multiplier = 0.85 + Math.sin(i / 12) * 0.25;
    }
    
    const cases = Math.max(12, Math.round(baseCount * multiplier + (Math.random() * 8 - 4)));
    const predicted = Math.max(10, Math.round(cases * (1 + (Math.random() * 0.08 - 0.04))));

    points.push({
      day: 90 - i,
      date: dateStr,
      cases,
      predicted,
      threshold: Math.round(baseCount * 1.35)
    });
  }
  return points;
};

export const DISEASE_DATA = {
  dengue: {
    id: "dengue",
    name: "Dengue Fever",
    tamilName: "டெங்கு காய்ச்சல்",
    pathogen: "Dengue Virus (DENV 1-4 Flavivirus)",
    vector: "Aedes aegypti & Aedes albopictus mosquito",
    transmission: "Daytime bite of infected female mosquito",
    incubation: "4 to 10 days",
    peakSeason: "October - December (North-East Monsoon)",
    totalCasesActive: 1984,
    mortalityRate: "0.24%",
    hospitalizationRate: "18.2%",
    color: "#f43f5e",
    summary: "Viral infection causing severe flu-like illness, sudden high fever, thrombocytopenia, and plasma leakage in severe dengue hemorrhagic cases.",
    symptoms: [
      "Sudden high-grade fever (104 F / 40 C)",
      "Severe retro-orbital (behind the eye) headache",
      "Excruciating joint and muscle pain (breakbone fever)",
      "Petechial rash and skin flushing",
      "Persistent nausea, vomiting, and loss of appetite",
      "Mild bleeding (nosebleeds, bleeding gums)"
    ],
    prevention: [
      "Empty, scrub, and invert water containers weekly (Source Reduction)",
      "Apply DEET or Picaridin mosquito repellents on exposed skin",
      "Ensure overhead water tanks and cisterns are tightly sealed",
      "Use insecticide-treated bed nets and window mesh screens",
      "Wear full-sleeved protective clothing during dawn and dusk hours"
    ],
    riskFactors: [
      "Stagnant clean rainwater in tires, coconut shells, and air coolers",
      "High population density and urban construction activity",
      "Intermittent municipal water supply requiring domestic storage",
      "Ambient temperatures between 26 C and 33 C accelerating viral replication"
    ],
    trends90d: generate90DayDiseaseTrend(65, "dengue")
  },
  cholera: {
    id: "cholera",
    name: "Cholera",
    tamilName: "காலரா",
    pathogen: "Vibrio cholerae (O1 and O139 serogroups)",
    vector: "Fecal-oral route via contaminated water/food",
    transmission: "Ingestion of food or water contaminated with Vibrio cholerae",
    incubation: "2 hours to 5 days",
    peakSeason: "June - September (South-West Monsoon & Flooding)",
    totalCasesActive: 742,
    mortalityRate: "1.10%",
    hospitalizationRate: "42.5%",
    color: "#06b6d4",
    summary: "Acute diarrheal infection caused by ingestion of food or water contaminated with Vibrio cholerae bacterium, leading to rapid severe dehydration.",
    symptoms: [
      "Profuse, painless watery diarrhea (rice-water stools)",
      "Rapid vomiting without prior nausea",
      "Severe muscle cramps caused by rapid electrolyte loss",
      "Sunken eyes, dry mucous membranes, and loss of skin elasticity",
      "Hypotension, tachycardia, and lethargy from hypovolemic shock",
      "Extreme thirst and oliguria (decreased urine output)"
    ],
    prevention: [
      "Drink only boiled, chlorinated, or sealed bottled water",
      "Wash hands thoroughly with soap before food handling and eating",
      "Ensure proper cooking of food and consume while hot",
      "Avoid raw seafood, unpasteurized dairy, and street vendor ice",
      "Superchlorination of community borewells and water tankers"
    ],
    riskFactors: [
      "Damaged municipal pipeline cross-connections with sewage drains",
      "Open defecation near surface water reservoirs",
      "Flooding and waterlogging in low-lying informal settlements",
      "Inadequate chlorine residual levels (<0.5 ppm) at consumer taps"
    ],
    trends90d: generate90DayDiseaseTrend(28, "cholera")
  },
  malaria: {
    id: "malaria",
    name: "Malaria",
    tamilName: "மலேரியா",
    pathogen: "Plasmodium vivax & Plasmodium falciparum",
    vector: "Anopheles stephensi & Anopheles culicifacies mosquito",
    transmission: "Nighttime bite of infected female Anopheles mosquito",
    incubation: "7 to 30 days",
    peakSeason: "July - November (Post-Monsoon Vector Surge)",
    totalCasesActive: 318,
    mortalityRate: "0.15%",
    hospitalizationRate: "14.0%",
    color: "#10b981",
    summary: "Parasitic blood disease transmitted by infected Anopheles mosquitoes, characterized by cyclical paroxysms of shaking chills, fever, and profuse diaphoresis.",
    symptoms: [
      "Cyclical high fever paroxysms occurring every 48 or 72 hours",
      "Severe shaking chills and shivering rigor",
      "Profuse sweating and exhaustion as body temperature drops",
      "Hemolytic anemia resulting in pallor and fatigue",
      "Hepatosplenomegaly (enlarged liver and spleen)",
      "Jaundice and dark urine in complicated Falciparum cases"
    ],
    prevention: [
      "Sleep under Long-Lasting Insecticidal Nets (LLINs)",
      "Indoor Residual Spraying (IRS) with synthetic pyrethroids",
      "Introduce larvivorous fish (Gambusia affinis) in overhead tanks",
      "Prompt blood smear examination (RDT/microscopy) for all fever cases",
      "Complete full prescribed course of Artemisinin Combination Therapy (ACT)"
    ],
    riskFactors: [
      "Urban overhead water tanks without hermetic lid seals (Anopheles stephensi)",
      "Irrigation canals, marshlands, and slow-moving streams",
      "Construction sites with water storage curing ponds",
      "Proximity to coastal backwaters and estuary salinity zones"
    ],
    trends90d: generate90DayDiseaseTrend(14, "malaria")
  }
};

export const getDiseaseData = (diseaseName) => {
  const key = diseaseName?.toLowerCase();
  return DISEASE_DATA[key] || DISEASE_DATA.dengue;
};
