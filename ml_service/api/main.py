from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os

from ml_service.prediction.predictors import EVPredictorService

app = FastAPI(
    title="ChargeWise AI - Machine Learning Prediction Service",
    description="FastAPI service serving XGBoost & Scikit-learn models for EV waiting time prediction, station recommendations, peak hour demand forecasting, and battery-aware route optimization.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = EVPredictorService()

class WaitTimeRequest(BaseModel):
    day_of_week: int = Field(..., ge=0, le=6, description="0: Mon, 6: Sun")
    hour_of_day: int = Field(..., ge=0, le=23)
    total_chargers: int = Field(..., gt=0)
    current_occupancy: int = Field(..., ge=0)

class StationRecItem(BaseModel):
    id: str
    name: str
    max_power_kw: float = 150.0
    price_per_kwh: float = 15.0
    distance_km: float = 5.0
    rating: float = 4.5
    predicted_wait_minutes: float = 0.0
    connector_type: str = "CCS2"

class StationRecRequest(BaseModel):
    user_lat: float
    user_lng: float
    battery_soc: float = 30.0
    preferred_connector: str = "CCS2"
    stations: List[StationRecItem]

class PeakHourRequest(BaseModel):
    hour: int = Field(..., ge=0, le=23)
    day: int = Field(..., ge=0, le=6)

class BatteryAwareRequest(BaseModel):
    current_soc: float = Field(..., ge=0, le=100)
    battery_capacity_kwh: float = Field(default=60.0, gt=0)
    destination_distance_km: float = Field(..., gt=0)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ChargeWise-ML-Engine",
        "models_loaded": predictor.wait_model is not None
    }

@app.post("/predict/waiting-time")
def predict_wait_time(req: WaitTimeRequest):
    return predictor.predict_waiting_time(
        day_of_week=req.day_of_week,
        hour_of_day=req.hour_of_day,
        total_chargers=req.total_chargers,
        current_occupancy=req.current_occupancy
    )

@app.post("/recommend/stations")
def recommend_stations(req: StationRecRequest):
    station_dicts = [s.model_dump() for s in req.stations]
    return predictor.recommend_stations(
        stations=station_dicts,
        user_lat=req.user_lat,
        user_lng=req.user_lng,
        battery_soc=req.battery_soc,
        preferred_connector=req.preferred_connector
    )

@app.post("/predict/peak-hours")
def predict_peak_hours(req: PeakHourRequest):
    return predictor.predict_peak_hours(hour=req.hour, day=req.day)

@app.post("/recommend/battery-aware")
def recommend_battery_aware(req: BatteryAwareRequest):
    return predictor.recommend_battery_aware(
        current_soc=req.current_soc,
        battery_capacity_kwh=req.battery_capacity_kwh,
        destination_distance_km=req.destination_distance_km
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
