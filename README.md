# ⚡ ChargeWise AI - Smart EV Charging Station Locator, Route Planning & Intelligent Slot Booking

[![ASP.NET Core 8](https://img.shields.io/badge/ASP.NET%20Core-8.0-blueviolet.svg)](https://dotnet.microsoft.com/)
[![React 18](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Python-FastAPI-emerald.svg)](https://fastapi.tiangolo.com/)
[![PostGIS](https://img.shields.io/badge/PostgreSQL-PostGIS-336791.svg)](https://postgis.net/)
[![XGBoost](https://img.shields.io/badge/ML-XGBoost-orange.svg)](https://xgboost.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**ChargeWise AI** is an enterprise-grade, production-ready EV Charging Station Locator, AI Route Planner, and Intelligent Slot Booking platform. Built using **Clean Architecture** with **ASP.NET Core 8 Web API**, **Python FastAPI Machine Learning microservice**, **React 18 + TypeScript + Tailwind CSS**, **PostgreSQL + PostGIS geospatial database**, and **Docker Compose**.

---

## 🌟 Key Features

### 🚗 User & Charging Station Module
- **Interactive Leaflet.js Map**: Real-time station pins with color-coded live availability status (Available, Busy, Offline).
- **PostGIS Geospatial Search**: High-performance spatial distance queries (`ST_DWithin`) with customizable radius.
- **Advanced Filtering**: Filter by connector standard (`CCS2`, `Supercharger`, `Type2`, `CHAdeMO`), charging speed (`≥150kW`), price rate, and rating.

### 🤖 Machine Learning Features (XGBoost & Scikit-learn)
1. **Waiting Time Prediction**: XGBoost Regressor predicts estimated queue waiting times based on current occupancy, day of week, hour of day, and total station chargers.
2. **Intelligent Station Recommendation**: Multi-attribute utility algorithm ranking optimal stations based on distance, traffic, speed, tariff rate, and user vehicle preferences.
3. **Battery-Aware Route Planner**: Calculates optimal route and automatically inserts required fast-charging stops based on EV State of Charge (SoC %) and battery capacity.
4. **Off-Peak Dynamic Slot Suggestions**: Recommends low-congestion booking hours.

### 📅 Slot Booking & Mock Payment Module
- **Conflict-Free Double-Booking Prevention**: Distributed locks & atomic database transactions.
- **QR Code Dispenser Pass**: Generates digital QR tokens (`CW-QR-XXXXXX`) for instant scanner verification.
- **Mock Payment Gateway**: Simulates card, UPI, and EV fleet wallet transactions with transaction reference IDs (`TXN-XXXXXX`).

### 📊 Enterprise Admin Operations Dashboard
- **Live Metrics**: Total monthly revenue, active stations, average wait times, and grid utilization percentage.
- **Recharts Analytics**: Interactive weekly revenue line charts and station utilization heatmaps.
- **ML Engine Accuracy Monitoring**: Real-time accuracy metrics for XGBoost predictors.

---

## 📐 Architecture & Technology Stack

### **Frontend**
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Crisp Light Theme Enterprise Aesthetic), Lucide Icons
- **Mapping & Charts**: Leaflet.js (OpenStreetMap), Recharts

### **Backend (Clean Architecture)**
- **Framework**: ASP.NET Core 8 Web API (C#)
- **Database**: Entity Framework Core 8, PostgreSQL 16 with PostGIS extension
- **Caching & Real-Time**: Redis 7.2, SignalR WebSockets (`StationHub.cs`)
- **Security**: JWT Bearer Authentication, Role-Based Policies (Admin/User), BCrypt Password Hashing

### **Machine Learning Service**
- **Framework**: Python 3.11, FastAPI, Uvicorn
- **ML Stack**: XGBoost, Scikit-learn, Pandas, NumPy, Joblib

---

## 🛠️ Quick Start & Local Setup

### Option 1: One-Command Docker Compose (Recommended)

Ensure Docker Desktop is installed and running:

```bash
docker compose up --build -d
```

Access the services:
- **Frontend Web Application**: [http://localhost:3000](http://localhost:3000)
- **ASP.NET Core Swagger API Docs**: [http://localhost:5000/swagger](http://localhost:5000/swagger)
- **Python FastAPI ML Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Nginx Unified Gateway**: [http://localhost](http://localhost)

---

### Option 2: Manual Local Development Setup

#### 1. Python ML Service Setup
```bash
cd ml_service
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m ml_service.training.train_models
uvicorn ml_service.api.main:app --reload --port 8000
```

#### 2. ASP.NET Core 8 Web API Setup
```bash
cd backend/ChargeWise.API
dotnet restore
dotnet build
dotnet run
```

#### 3. React Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 API Documentation Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | User Registration |
| `POST` | `/api/auth/login` | JWT User Login |
| `GET` | `/api/stations` | List stations with PostGIS distance & ML wait time |
| `POST` | `/api/bookings` | Book a charging slot (Prevent double-booking) |
| `GET` | `/api/bookings/my-bookings` | Fetch user booking history & QR tokens |
| `POST` | `/api/route/plan` | Calculate battery-aware route & charging stops |
| `POST` | `/predict/waiting-time` | FastAPI endpoint for XGBoost wait time prediction |
| `POST` | `/recommend/stations` | FastAPI station recommendation algorithm |

---

## 📂 Project Structure

```
ChargeWise AI/
├── docs/                     # Architecture & ERD Specifications
├── database/                 # SQL Schemas & Seed Data
├── frontend/                 # React + TypeScript + Tailwind + Leaflet
├── backend/                  # ASP.NET Core 8 Clean Architecture
│   ├── ChargeWise.Core       # Domain Entities, DTOs, Interfaces
│   ├── ChargeWise.Infrastructure # EF Core, Repositories, Redis, Services
│   └── ChargeWise.API        # Controllers, SignalR Hubs, Swagger
├── ml_service/               # Python FastAPI Machine Learning Microservice
├── docker-compose.yml        # Docker Multi-Container Configuration
├── nginx.conf                # Unified Reverse Proxy Gateway
└── README.md
```

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).
