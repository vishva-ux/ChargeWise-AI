import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from xgboost import XGBRegressor

def train_and_save_models():
    dataset_path = "ml_service/datasets/ev_charging_history.csv"
    if not os.path.exists(dataset_path):
        from ml_service.datasets.generate_dataset import generate_ev_dataset
        df = generate_ev_dataset(output_path=dataset_path)
    else:
        df = pd.read_csv(dataset_path)

    os.makedirs("ml_service/models", exist_ok=True)

    print("Training ML Model 1: Waiting Time Predictor (XGBoost)...")
    X_wait = df[["day_of_week", "hour_of_day", "is_peak", "total_chargers", "current_occupancy", "station_utilization"]]
    y_wait = df["waiting_time_minutes"]

    X_train, X_test, y_train, y_test = train_test_split(X_wait, y_wait, test_size=0.2, random_state=42)

    wait_model = XGBRegressor(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42)
    wait_model.fit(X_train, y_train)

    train_score = wait_model.score(X_train, y_train)
    test_score = wait_model.score(X_test, y_test)
    print(f"Waiting Time Model Trained. R2 Train: {train_score:.4f}, R2 Test: {test_score:.4f}")

    joblib.dump(wait_model, "ml_service/models/waiting_time_model.joblib")

    print("Training ML Model 2: Peak Hour Classifier...")
    X_peak = df[["hour_of_day", "day_of_week", "total_chargers", "station_utilization"]]
    y_peak = df["is_peak"]

    peak_model = RandomForestClassifier(n_estimators=50, random_state=42)
    peak_model.fit(X_peak, y_peak)
    joblib.dump(peak_model, "ml_service/models/peak_hour_model.joblib")

    print("Saving ML metadata & Scalers...")
    metadata = {
        "features_wait": list(X_wait.columns),
        "features_peak": list(X_peak.columns),
        "accuracy_r2": float(test_score)
    }
    joblib.dump(metadata, "ml_service/models/model_metadata.joblib")
    print("All ML models successfully trained and serialized to 'ml_service/models/'!")

if __name__ == "__main__":
    train_and_save_models()
