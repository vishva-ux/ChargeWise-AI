import pandas as pd
import numpy as np
import os

def generate_ev_dataset(num_records=10000, output_path="ml_service/datasets/ev_charging_history.csv"):
    np.random.seed(42)

    station_ids = [f"STATION_{i:03d}" for i in range(1, 21)]
    days_of_week = list(range(7)) # 0: Mon ... 6: Sun
    hours_of_day = list(range(24))

    records = []
    for _ in range(num_records):
        st_id = np.random.choice(station_ids)
        day = np.random.choice(days_of_week)
        hour = np.random.choice(hours_of_day)

        # Base occupancy higher during peak hours (8-10 AM, 5-8 PM)
        is_peak = 1 if (8 <= hour <= 10) or (17 <= hour <= 20) else 0
        total_chargers = np.random.choice([4, 6, 8, 10, 12])

        if is_peak:
            occupancy_rate = np.random.uniform(0.6, 1.0)
        else:
            occupancy_rate = np.random.uniform(0.1, 0.6)

        current_occupancy = int(total_chargers * occupancy_rate)
        station_utilization = round(current_occupancy / total_chargers, 2)

        # Calculate actual waiting time (minutes) based on occupancy and chargers
        if station_utilization >= 0.8:
            base_wait = (station_utilization - 0.7) * 45
            jitter = np.random.normal(0, 3)
            wait_time_minutes = max(0, round(base_wait + jitter, 1))
        else:
            wait_time_minutes = 0.0

        # Charger details
        charger_type = np.random.choice(["Supercharger", "CCS2", "Type2", "CHAdeMO"], p=[0.2, 0.5, 0.2, 0.1])
        power_kw = 250 if charger_type == "Supercharger" else (150 if charger_type == "CCS2" else 50)
        price_per_kwh = round(np.random.uniform(12.0, 24.0), 2)
        distance_km = round(np.random.uniform(1.0, 25.0), 1)

        records.append({
            "station_id": st_id,
            "day_of_week": day,
            "hour_of_day": hour,
            "is_peak": is_peak,
            "total_chargers": total_chargers,
            "current_occupancy": current_occupancy,
            "station_utilization": station_utilization,
            "charger_type": charger_type,
            "power_kw": power_kw,
            "price_per_kwh": price_per_kwh,
            "distance_km": distance_km,
            "waiting_time_minutes": wait_time_minutes
        })

    df = pd.DataFrame(records)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} synthetic EV dataset records at '{output_path}'.")
    return df

if __name__ == "__main__":
    generate_ev_dataset()
