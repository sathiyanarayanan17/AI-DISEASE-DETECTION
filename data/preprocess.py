"""
preprocess.py
Merges IMD + IDSP data, engineers rich features, labels risk levels,
and saves processed_data.csv.

Feature groups:
  1. Raw weather        : rainfall, temperature, humidity
  2. Rolling stats      : 7/14/30-day rolling mean of cases + weather
  3. Lag features       : 7/14/21-day lag for cases (incubation windows)
  4. Trend features     : 7d case change rate (is outbreak growing?)
  5. Disease split      : separate rolling for cholera, dengue, malaria
  6. Calendar           : month, week_of_year, is_monsoon, is_ne_monsoon
  7. Geography          : is_coastal, is_urban, is_hill (one-hot)
  8. Interaction        : rainfall*humidity, temperature*humidity
  9. EWMA              : exponentially weighted moving averages for cases
  10. Acceleration      : rate of change (2nd derivative of cases)
  11. Outbreak history  : district-level historical outbreak frequency
  12. Outbreak flag     : sudden spike detection (binary)
"""

import os
import sys
import logging
import numpy as np
import pandas as pd
import importlib.util
from datetime import datetime

# --- Logging setup ---
LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(
            os.path.join(LOG_DIR, f"preprocess_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
        ),
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger(__name__)

# --- Paths ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
IMD_PATH   = os.path.join(SCRIPT_DIR, "imd_data.csv")
IDSP_PATH  = os.path.join(SCRIPT_DIR, "idsp_data.csv")
OUT_PATH   = os.path.join(SCRIPT_DIR, "processed_data.csv")

# --- Geography ---
COASTAL = {
    "Chennai", "Cuddalore", "Nagapattinam", "Tiruvarur",
    "Ramanathapuram", "Thoothukudi", "Kancheepuram",
    "Chengalpattu", "Mayiladuthurai", "Villupuram", "Puducherry"
}
HILL  = {"Nilgiris"}
URBAN = {"Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur"}

# --- Feature column lists (backward compatible) ---
FEATURE_COLUMNS = [
    "rainfall_mm", "temperature_c", "humidity_pct",
    "rolling_7d_cases", "rolling_14d_cases", "rolling_30d_cases",
    "lag_7_cases", "lag_14_cases", "lag_21_cases",
    "case_trend_7d",
    "cholera_cases_7d_avg", "dengue_cases_7d_avg", "malaria_cases_7d_avg",
    "rainfall_7d_avg", "rainfall_14d_avg", "temp_7d_avg", "humidity_7d_avg",
    "month", "week_of_year", "day_of_year",
    "is_sw_monsoon", "is_ne_monsoon",
    "is_coastal", "is_urban", "is_hill",
]

# Extended features include original 25 + new engineered features
EXTENDED_FEATURES = FEATURE_COLUMNS + [
    # Interaction features
    "rainfall_x_humidity",
    "temperature_x_humidity",
    # EWMA features
    "ewma_7d_cases",
    "ewma_14d_cases",
    "ewma_30d_cases",
    # Rate of change / acceleration
    "case_acceleration_7d",
    "case_acceleration_14d",
    # District historical outbreak frequency
    "district_outbreak_freq",
    # Outbreak flag (binary spike detection)
    "outbreak_flag",
]


def _run_generator():
    """Import and run generate_sample_data.py to create raw CSVs."""
    gen = os.path.join(SCRIPT_DIR, "generate_sample_data.py")
    if not os.path.exists(gen):
        logger.error(f"Generator script not found: {gen}")
        raise FileNotFoundError(f"Cannot find {gen}")
    spec = importlib.util.spec_from_file_location("gen", gen)
    mod  = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.main()


def _data_quality_checks(df: pd.DataFrame, name: str) -> pd.DataFrame:
    """Run data quality checks and log issues."""
    logger.info(f"  Data quality checks for '{name}' ({df.shape[0]} rows, {df.shape[1]} cols)")

    # Check for duplicates
    dup_count = df.duplicated(subset=["district", "date"]).sum()
    if dup_count > 0:
        logger.warning(f"  Found {dup_count} duplicate (district, date) rows in {name}. Dropping.")
        df = df.drop_duplicates(subset=["district", "date"], keep="first")

    # Check for missing values
    missing = df.isnull().sum()
    cols_with_missing = missing[missing > 0]
    if len(cols_with_missing) > 0:
        for col, cnt in cols_with_missing.items():
            pct = 100 * cnt / len(df)
            logger.warning(f"  {name}.{col}: {cnt} missing ({pct:.2f}%)")
    else:
        logger.info(f"  No missing values in {name}")

    # Check for negative values in numeric columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        neg_count = (df[col] < 0).sum()
        if neg_count > 0:
            logger.warning(f"  {name}.{col}: {neg_count} negative values found. Clipping to 0.")
            df[col] = df[col].clip(lower=0)

    # Check date range
    if "date" in df.columns:
        date_min = df["date"].min()
        date_max = df["date"].max()
        logger.info(f"  Date range: {date_min} to {date_max}")

    # Check district count
    if "district" in df.columns:
        n_districts = df["district"].nunique()
        logger.info(f"  Districts found: {n_districts}")
        if n_districts != 37:
            logger.warning(f"  Expected 37 districts, found {n_districts}")

    return df


def load_raw():
    """Load raw IMD and IDSP CSVs, generating them if not present."""
    if not os.path.exists(IMD_PATH) or not os.path.exists(IDSP_PATH):
        logger.info("  Raw CSVs not found -> generating ...")
        _run_generator()

    imd = pd.read_csv(IMD_PATH, parse_dates=["date"])
    idsp = pd.read_csv(IDSP_PATH, parse_dates=["date"])

    # Run quality checks
    imd = _data_quality_checks(imd, "IMD")
    idsp = _data_quality_checks(idsp, "IDSP")

    return imd, idsp


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Engineer all features including original + extended."""
    df = df.sort_values(["district", "date"]).reset_index(drop=True)

    def roll(series, w):
        return series.rolling(w, min_periods=w).mean()

    grp_cases = df.groupby("district", sort=False)["total_cases"]

    # --- Original features (backward compatible) ---

    # Rolling statistics
    df["rolling_7d_cases"]  = grp_cases.transform(lambda s: roll(s, 7))
    df["rolling_14d_cases"] = grp_cases.transform(lambda s: roll(s, 14))
    df["rolling_30d_cases"] = grp_cases.transform(lambda s: roll(s, 30))

    # Lag features
    df["lag_7_cases"]  = grp_cases.transform(lambda s: s.shift(7))
    df["lag_14_cases"] = grp_cases.transform(lambda s: s.shift(14))
    df["lag_21_cases"] = grp_cases.transform(lambda s: s.shift(21))

    # Trend (1st derivative)
    df["case_trend_7d"] = grp_cases.transform(
        lambda s: s.rolling(7, min_periods=7).mean().diff(7)
    )

    # Disease-specific rolling
    for disease in ["cholera_cases", "dengue_cases", "malaria_cases"]:
        df[f"{disease}_7d_avg"] = (
            df.groupby("district", sort=False)[disease]
            .transform(lambda s: roll(s, 7))
        )

    # Weather rolling
    for col, alias, w in [
        ("rainfall_mm",   "rainfall_7d_avg",  7),
        ("rainfall_mm",   "rainfall_14d_avg", 14),
        ("temperature_c", "temp_7d_avg",       7),
        ("humidity_pct",  "humidity_7d_avg",   7),
    ]:
        df[alias] = (
            df.groupby("district", sort=False)[col]
            .transform(lambda s, _w=w: roll(s, _w))
        )

    # Calendar features
    df["month"]        = df["date"].dt.month
    df["week_of_year"] = df["date"].dt.isocalendar().week.astype(int)
    df["day_of_year"]  = df["date"].dt.dayofyear
    df["is_sw_monsoon"] = df["month"].isin([6, 7, 8, 9]).astype(int)
    df["is_ne_monsoon"] = df["month"].isin([10, 11, 12]).astype(int)

    # Geography features
    df["is_coastal"] = df["district"].isin(COASTAL).astype(int)
    df["is_urban"]   = df["district"].isin(URBAN).astype(int)
    df["is_hill"]    = df["district"].isin(HILL).astype(int)

    # --- NEW: Interaction features ---
    df["rainfall_x_humidity"]    = df["rainfall_mm"] * df["humidity_pct"]
    df["temperature_x_humidity"] = df["temperature_c"] * df["humidity_pct"]

    # --- NEW: Exponentially Weighted Moving Averages (EWMA) ---
    df["ewma_7d_cases"] = (
        df.groupby("district", sort=False)["total_cases"]
        .transform(lambda s: s.ewm(span=7, min_periods=7).mean())
    )
    df["ewma_14d_cases"] = (
        df.groupby("district", sort=False)["total_cases"]
        .transform(lambda s: s.ewm(span=14, min_periods=14).mean())
    )
    df["ewma_30d_cases"] = (
        df.groupby("district", sort=False)["total_cases"]
        .transform(lambda s: s.ewm(span=30, min_periods=30).mean())
    )

    # --- NEW: Acceleration (rate of change of trend = 2nd derivative) ---
    # 7-day acceleration: how fast the 7d trend itself is changing
    df["case_acceleration_7d"] = (
        df.groupby("district", sort=False)["total_cases"]
        .transform(
            lambda s: s.rolling(7, min_periods=7).mean().diff(7).diff(7)
        )
    )
    # 14-day acceleration
    df["case_acceleration_14d"] = (
        df.groupby("district", sort=False)["total_cases"]
        .transform(
            lambda s: s.rolling(14, min_periods=14).mean().diff(14).diff(14)
        )
    )

    # --- NEW: District historical outbreak frequency ---
    # Computed as the fraction of historical days where cases exceeded
    # the district's 90th percentile (expanding window, so no future leakage)
    def _outbreak_freq(s):
        """Rolling outbreak frequency: fraction of past days that were outbreaks."""
        result = pd.Series(np.nan, index=s.index)
        # Use expanding window with a minimum of 30 days
        threshold = s.expanding(min_periods=30).quantile(0.90)
        is_outbreak = (s > threshold).astype(float)
        # Expanding mean gives historical frequency
        result = is_outbreak.expanding(min_periods=30).mean()
        return result

    df["district_outbreak_freq"] = (
        df.groupby("district", sort=False)["total_cases"]
        .transform(_outbreak_freq)
    )

    # --- NEW: Outbreak flag (sudden spike detection) ---
    # Flag = 1 if current cases > 2 * rolling_14d average (sudden doubling)
    # This uses a 14-day baseline to detect anomalous spikes
    def _outbreak_flag(s):
        baseline = s.rolling(14, min_periods=14).mean()
        std_14d = s.rolling(14, min_periods=14).std()
        # Spike if current value > baseline + 2*std (statistical spike)
        flag = ((s > baseline + 2 * std_14d) & (s > baseline * 2)).astype(int)
        return flag

    df["outbreak_flag"] = (
        df.groupby("district", sort=False)["total_cases"]
        .transform(_outbreak_flag)
    )

    logger.info(f"  Engineered {df.shape[1]} total columns")
    logger.info(f"  Original features: {len(FEATURE_COLUMNS)}")
    logger.info(f"  Extended features: {len(EXTENDED_FEATURES)}")

    return df


def label_risk(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adaptive risk labeling using percentile-based thresholds per district.

    Instead of fixed global thresholds, each district gets its own thresholds
    based on its historical case distribution:
      - Low:    below district's 50th percentile of rolling_7d_cases
      - Medium: between 50th and 85th percentile
      - High:   above 85th percentile

    An upward trend (acceleration) can bump the risk level up by 1.
    """
    df = df.copy()

    # Calculate per-district percentile thresholds
    district_stats = df.groupby("district")["rolling_7d_cases"].agg(
        p50=lambda x: x.quantile(0.50),
        p85=lambda x: x.quantile(0.85),
    ).reset_index()

    logger.info("  Per-district adaptive thresholds (sample):")
    for _, row in district_stats.head(5).iterrows():
        logger.info(f"    {row['district']}: p50={row['p50']:.1f}, p85={row['p85']:.1f}")

    # Merge thresholds back
    df = df.merge(district_stats, on="district", how="left")

    cases = df["rolling_7d_cases"]
    p50 = df["p50"]
    p85 = df["p85"]
    trend = df["case_trend_7d"].fillna(0)

    # Base risk from adaptive percentile thresholds
    base_risk = np.select(
        [cases < p50, (cases >= p50) & (cases <= p85), cases > p85],
        [0, 1, 2],
        default=0
    )

    # Bump risk up if cases are accelerating rapidly
    # Use positive acceleration (cases growing faster) as escalation signal
    acceleration = df["case_acceleration_7d"].fillna(0)
    escalation = ((trend > 5) & (acceleration > 0)).astype(int)

    df["risk_level"] = np.minimum(base_risk + escalation, 2).astype(int)

    # Drop temporary threshold columns
    df.drop(columns=["p50", "p85"], inplace=True)

    return df


def validate_output(df: pd.DataFrame) -> bool:
    """Final validation of the processed dataset."""
    is_valid = True

    # Check all original feature columns exist
    missing_features = [f for f in FEATURE_COLUMNS if f not in df.columns]
    if missing_features:
        logger.error(f"  Missing original features: {missing_features}")
        is_valid = False

    # Check all extended feature columns exist
    missing_extended = [f for f in EXTENDED_FEATURES if f not in df.columns]
    if missing_extended:
        logger.error(f"  Missing extended features: {missing_extended}")
        is_valid = False

    # Check risk_level is valid
    if "risk_level" in df.columns:
        unique_risks = df["risk_level"].unique()
        invalid = [r for r in unique_risks if r not in [0, 1, 2]]
        if invalid:
            logger.error(f"  Invalid risk levels found: {invalid}")
            is_valid = False
    else:
        logger.error("  'risk_level' column missing")
        is_valid = False

    # Check for infinite values
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    inf_counts = np.isinf(df[numeric_cols]).sum()
    cols_with_inf = inf_counts[inf_counts > 0]
    if len(cols_with_inf) > 0:
        for col, cnt in cols_with_inf.items():
            logger.warning(f"  {col}: {cnt} infinite values -> replacing with NaN")
        df[numeric_cols] = df[numeric_cols].replace([np.inf, -np.inf], np.nan)

    # Check no all-NaN feature columns in final output
    all_nan_cols = df[EXTENDED_FEATURES].columns[df[EXTENDED_FEATURES].isnull().all()]
    if len(all_nan_cols) > 0:
        logger.warning(f"  Columns that are all NaN: {list(all_nan_cols)}")

    if is_valid:
        logger.info("  [OK] Output validation passed")
    else:
        logger.error("  [FAIL] Output validation FAILED")

    return is_valid


def main():
    """Main preprocessing pipeline."""
    print("=" * 60)
    print("  Preprocessing Pipeline -- Tamil Nadu EarlyAlert")
    print("  (Enhanced with interaction, EWMA, acceleration,")
    print("   outbreak detection, and adaptive risk labeling)")
    print("=" * 60)

    logger.info("Pipeline started")

    # --- Step 1: Load raw data ---
    print("\n[1/7] Loading raw data ...")
    imd, idsp = load_raw()
    print(f"      IMD : {imd.shape}  |  IDSP : {idsp.shape}")

    # --- Step 2: Merge ---
    print("\n[2/7] Merging on district + date ...")
    merged = pd.merge(
        imd,
        idsp[["district", "date", "cholera_cases", "dengue_cases",
              "malaria_cases", "total_cases"]],
        on=["district", "date"], how="inner"
    )
    print(f"      Merged shape : {merged.shape}")
    logger.info(f"Merged shape: {merged.shape}")

    # --- Step 3: Data quality on merged ---
    print("\n[3/7] Running data quality checks on merged data ...")
    merged = _data_quality_checks(merged, "merged")

    # --- Step 4: Feature engineering ---
    print("\n[4/7] Engineering features (original + extended) ...")
    featured = engineer_features(merged)
    print(f"      Total columns : {featured.shape[1]}")
    print(f"      Original features (25) : {len(FEATURE_COLUMNS)}")
    print(f"      Extended features ({len(EXTENDED_FEATURES)}) : {len(EXTENDED_FEATURES)}")

    # --- Step 5: Risk labeling (adaptive) ---
    print("\n[5/7] Labelling risk levels (adaptive percentile-based) ...")
    labelled = label_risk(featured)

    # --- Step 6: Clean up ---
    print("\n[6/7] Dropping NaN warm-up rows & validation ...")
    # Replace infinities before dropping
    numeric_cols = labelled.select_dtypes(include=[np.number]).columns
    labelled[numeric_cols] = labelled[numeric_cols].replace([np.inf, -np.inf], np.nan)

    before = len(labelled)
    labelled = labelled.dropna(subset=EXTENDED_FEATURES + ["risk_level"]).reset_index(drop=True)
    after = len(labelled)
    print(f"      {before - after:,} dropped -> {after:,} clean rows")
    logger.info(f"Dropped {before - after} warm-up rows, {after} remaining")

    # --- Step 7: Validate & save ---
    print("\n[7/7] Validating output & saving ...")
    validate_output(labelled)

    labelled.to_csv(OUT_PATH, index=False)
    print(f"\n-> Saved -> {OUT_PATH}")
    logger.info(f"Saved to {OUT_PATH}")

    # --- Summary statistics ---
    label_map = {0: "Low", 1: "Medium", 2: "High"}
    print("\n-- Class distribution -----------------------------------")
    for k, v in labelled["risk_level"].value_counts().sort_index().items():
        print(f"   {k} ({label_map[k]:6s}) : {v:6,}  ({100*v/after:.1f}%)")

    print("\n-- Extended feature statistics ---------------------------")
    new_features = [f for f in EXTENDED_FEATURES if f not in FEATURE_COLUMNS]
    for feat in new_features:
        if feat in labelled.columns:
            stats = labelled[feat].describe()
            print(f"   {feat:30s} : mean={stats['mean']:8.2f}  std={stats['std']:8.2f}")

    print("\n-- Outbreak flag summary --------------------------------")
    if "outbreak_flag" in labelled.columns:
        flag_sum = labelled["outbreak_flag"].sum()
        flag_pct = 100 * flag_sum / len(labelled)
        print(f"   Total outbreak flags : {int(flag_sum):,} ({flag_pct:.2f}% of rows)")
        # Per-district outbreak flags
        top_outbreak = (
            labelled.groupby("district")["outbreak_flag"]
            .sum()
            .sort_values(ascending=False)
            .head(5)
        )
        print("   Top 5 districts by outbreak flags:")
        for dist, cnt in top_outbreak.items():
            print(f"     {dist:25s} : {int(cnt)}")

    logger.info("Pipeline completed successfully")
    return labelled


if __name__ == "__main__":
    main()
