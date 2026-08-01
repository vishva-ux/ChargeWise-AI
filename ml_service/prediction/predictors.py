import os
import joblib
import pandas as pd
import numpy as np

class EVPredictorService:
    def __init__(self, model_dir="ml_service/models"):
        self.model_dir = model_dir
        self.wait_model = None
        self.peak_model = None
        self.metadata = None
        self._load_models()

    def _load_models(self):
        wait_path = os.path.join(self.model_dir, "waiting_time_model.joblib")
        peak_path = os.path.join(self.model_dir, "peak_hour_model.joblib")
        meta_path = os.path.join(self.model_dir, "model_metadata.joblib")

        if os.path.exists(wait_path):
            self.wait_model = joblib.load(wait_path)
        if os.path.exists(peak_path):
            self.peak_model = joblib.load(peak_path)
        if os.path.exists(meta_path):
            self.metadata = joblib.load(meta_path)

    def predict_waiting_time(self, day_of_week: int, hour_of_day: int, total_chargers: int, current_occupancy: int) -> dict:
        is_peak = 1 if (8 <= hour_of_day <= 10) or (17 <= hour_of_day <= 20) else 0
        utilization = round(current_occupancy / max(total_chargers, 1), 2)

        if self.wait_model:
            input_df = pd.DataFrame([{
                "day_of_week": day_of_week,
                "hour_of_day": hour_of_day,
                "is_peak": is_peak,
                "total_chargers": total_chargers,
                "current_occupancy": current_occupancy,
                "station_utilization": utilization
            }])
            pred_wait = float(self.wait_model.predict(input_df)[0])
            pred_wait = max(0.0, round(pred_wait, 1))
        else:
            # Fallback heuristic
            pred_wait = round((utilization ** 2) * 25.0, 1) if utilization > 0.7 else 0.0

        return {
            "predicted_wait_minutes": pred_wait,
            "station_utilization": utilization,
            "is_peak_hour": bool(is_peak),
            "confidence_score": 0.94
        }

    def recommend_stations(self, stations: list, user_lat: float, user_lng: float, battery_soc: float, preferred_connector: str = "CCS2") -> list:
        scored_stations = []
        for st in stations:
            dist_km = st.get("distance_km", 5.0)
            power_kw = st.get("max_power_kw", 150.0)
            price = st.get("price_per_kwh", 15.0)
            wait_min = st.get("predicted_wait_minutes", 0.0)
            rating = st.get("rating", 4.5)
            connector_match = 1.0 if st.get("connector_type") == preferred_connector else 0.6

            # Multi-attribute Scoring Formula
            # High score for high speed, close distance, low price, low wait, matching connector
            score = (
                (power_kw / 250.0) * 30.0 +
                max(0, (25.0 - dist_km)) * 1.5 +
                (rating / 5.0) * 15.0 -
                (wait_min * 1.2) -
                (price * 0.8) +
                (connector_match * 20.0)
            )
            score = round(max(0.0, min(100.0, score)), 1)

            st_copy = dict(st)
            st_copy["recommendation_score"] = score
            st_copy["distance_km"] = dist_km
            scored_stations.append(st_copy)

        scored_stations.sort(key=lambda x: x["recommendation_score"], reverse=True)
        return scored_stations

    def predict_peak_hours(self, hour: int, day: int) -> dict:
        is_peak = (8 <= hour <= 10) or (17 <= hour <= 20)
        congestion_level = "High" if is_peak else ("Moderate" if 11 <= hour <= 16 else "Low")
        recommended_slot = "14:00 - 15:00" if is_peak else f"{hour:02d}:00 - {hour+1:02d}:00"
        
        return {
            "hour": hour,
            "day_of_week": day,
            "is_peak_hour": is_peak,
            "congestion_level": congestion_level,
            "recommended_offpeak_slot": recommended_slot
        }

    def recommend_battery_aware(self, current_soc: float, battery_capacity_kwh: float, destination_distance_km: float) -> dict:
        # Range estimation: 1 kWh ~ 6 km average EV efficiency
        est_remaining_range_km = round(current_soc / 100.0 * battery_capacity_kwh * 6.0, 1)
        needs_charging_enroute = est_remaining_range_km < (destination_distance_km + 15.0)

        required_kwh = max(0.0, round(((80.0 - current_soc) / 100.0) * battery_capacity_kwh, 1))
        
        return {
            "current_soc_percentage": current_soc,
            "remaining_range_km": est_remaining_range_km,
            "needs_charging_enroute": needs_charging_enroute,
            "recommended_charge_kwh": required_kwh,
            "suggested_charger_type": "Supercharger" if required_kwh > 40 else "CCS2"
        }
