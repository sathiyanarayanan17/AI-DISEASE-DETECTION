# generate_sample_data.py
# Tamil Nadu EarlyAlert - Synthetic IMD + IDSP data generator
# 37 districts, 3 years (2022-2024), 3 diseases

import os
import sys
import numpy as np
import pandas as pd

np.random.seed(42)

DISTRICTS = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Vellore", "Erode", "Thoothukudi", "Tiruppur",
    "Dindigul", "Thanjavur", "Sivagangai", "Kancheepuram",
    "Krishnagiri", "Dharmapuri", "Cuddalore", "Nagapattinam", "Villupuram",
    "Perambalur", "Ariyalur", "Karur", "Namakkal", "Ramanathapuram",
    "Virudhunagar", "Tiruvannamalai", "Tiruvarur", "Pudukkottai", "Nilgiris",
    "Kallakurichi", "Chengalpattu", "Tenkasi", "Mayiladuthurai",
    "Tirupattur", "Ranipet", "Kanyakumari", "Puducherry",
]

COASTAL = {
    "Chennai", "Cuddalore", "Nagapattinam", "Tiruvarur",
    "Ramanathapuram", "Thoothukudi", "Kancheepuram",
    "Chengalpattu", "Mayiladuthurai", "Villupuram", "Puducherry"
}
HILL  = {"Nilgiris"}
URBAN = {"Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur"}

START_DATE = "2022-01-01"
END_DATE   = "2024-12-31"
SAVE_DIR   = os.path.dirname(os.path.abspath(__file__))


def generate_imd_data():
    dates = pd.date_range(START_DATE, END_DATE, freq="D")
    n = len(dates)
    doy = dates.dayofyear.to_numpy(dtype=float)

    imd_records = []
    for district in DISTRICTS:
        sw = np.clip(np.sin(np.pi * (doy - 60) / 180), 0, None)
        ne = np.zeros(n)
        ne_mask = (doy >= 274) & (doy <= 365)
        ne[ne_mask] = np.clip(np.sin(np.pi * (doy[ne_mask] - 244) / 90), 0, None)

        ne_f = 2.5 if district in COASTAL else 1.0
        sw_f = 0.6 if district in COASTAL else 1.0
        if district in HILL:
            ne_f, sw_f = ne_f * 1.3, sw_f * 1.5

        rain_mean = np.maximum(sw * 8 * sw_f + ne * 15 * ne_f, 0.3)
        rainfall = np.array([np.random.exponential(m) for m in rain_mean])
        rainfall = np.round(np.clip(rainfall, 0, 200), 2)

        if district in HILL:
            t_mean, t_amp = 18.0, 6.0
        elif district in COASTAL:
            t_mean, t_amp = 30.0, 5.0
        else:
            t_mean, t_amp = 31.0, 7.0

        temp = t_mean + t_amp * np.sin(2 * np.pi * (doy - 20) / 365)
        temp = temp - (sw * 2 + ne * 1.5) + np.random.normal(0, 1.2, n)
        temp = np.round(np.clip(temp, 10, 45), 1)

        h_base = 75.0 if district in COASTAL else 58.0
        hum = h_base + sw * 15 + ne * 20 + np.random.normal(0, 6, n)
        hum = np.round(np.clip(hum, 25, 98), 1)

        for i in range(n):
            imd_records.append({
                "district": district,
                "date": str(dates[i].date()),
                "rainfall_mm": float(rainfall[i]),
                "temperature_c": float(temp[i]),
                "humidity_pct": float(hum[i]),
            })

    return pd.DataFrame(imd_records)


def generate_idsp_data(imd_df):
    idsp_records = []

    for district in DISTRICTS:
        sub = imd_df[imd_df["district"] == district].sort_values("date").reset_index(drop=True)
        n = len(sub)
        rain  = sub["rainfall_mm"].values.astype(float)
        hum   = sub["humidity_pct"].values.astype(float)
        temp  = sub["temperature_c"].values.astype(float)
        month = pd.to_datetime(sub["date"]).dt.month.values

        def lag(arr, k):
            out = np.zeros(n)
            if k < n:
                out[k:] = arr[:n - k]
            return out

        u = 2.0 if district in URBAN else 1.0
        c = 1.3 if district in COASTAL else 1.0

        ch_lam = np.clip(
            (lag(rain,7)*0.5 + lag(rain,14)*0.3 + lag(hum,7)*0.15) * u * c
            * np.where(np.isin(month, [11,12,1,2]), 2.0, 1.0),
            0.5, 200
        )
        cholera = np.random.poisson(ch_lam).astype(int)

        t14 = lag(temp, 14)
        t_ok = np.where((t14 >= 25) & (t14 <= 32), 1.5, 0.8)
        de_lam = np.clip(
            (lag(rain,14)*0.4 + lag(rain,21)*0.3 + lag(hum,7)*0.1) * t_ok * u
            * np.where(np.isin(month,[9,10,11]), 3.0, np.where(np.isin(month,[7,8,12]), 1.5, 0.8)),
            0.2, 200
        )
        dengue = np.random.poisson(de_lam).astype(int)

        r = 0.5 if district in URBAN else 1.2
        t_ok2 = np.where((temp >= 25) & (temp <= 32), 1.8, 0.6)
        ma_lam = np.clip(
            (lag(rain,10)*0.5 + lag(hum,7)*0.15) * r * t_ok2
            * np.where(np.isin(month,[7,8,9,10]), 2.5, 1.0),
            0.1, 200
        )
        malaria = np.random.poisson(ma_lam).astype(int)

        total = cholera + dengue + malaria
        dates = sub["date"].values

        for i in range(n):
            idsp_records.append({
                "district": district,
                "date": str(dates[i]),
                "cholera_cases": int(cholera[i]),
                "dengue_cases":  int(dengue[i]),
                "malaria_cases": int(malaria[i]),
                "total_cases":   int(total[i]),
            })

    return pd.DataFrame(idsp_records)


def main():
    print("Generating Tamil Nadu IMD + IDSP data ...")
    print("  Districts : " + str(len(DISTRICTS)))
    print("  Period    : " + START_DATE + " to " + END_DATE)

    print("\n[1/2] Weather data ...")
    imd_df = generate_imd_data()
    p1 = os.path.join(SAVE_DIR, "imd_data.csv")
    imd_df.to_csv(p1, index=False)
    print("  Saved: " + p1 + " (" + str(len(imd_df)) + " rows)")

    print("\n[2/2] Disease data ...")
    idsp_df = generate_idsp_data(imd_df)
    p2 = os.path.join(SAVE_DIR, "idsp_data.csv")
    idsp_df.to_csv(p2, index=False)
    print("  Saved: " + p2 + " (" + str(len(idsp_df)) + " rows)")

    print("\nData generation complete.")


if __name__ == "__main__":
    main()
