# ChargeWise AI - System Architecture Specification

## 1. High-Level System Architecture Diagram

```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer"]
        WebClient["React 18 + TypeScript Web App\n(Leaflet.js + Tailwind + Recharts)"]
        MobileBrowser["Responsive Mobile Browser"]
    end

    subgraph GatewayLayer ["Reverse Proxy & Gateway"]
        Nginx["Nginx Reverse Proxy / Load Balancer\n(Port 80 / 443)"]
    end

    subgraph ApplicationLayer ["Core Application Services"]
        DotNetAPI["ASP.NET Core 8 Web API\n(Clean Architecture & C#)"]
        SignalRHub["SignalR Real-Time Hub\n(Station Availability & Slot Updates)"]
    end

    subgraph IntelligenceLayer ["Machine Learning Microservice"]
        FastAPI["Python FastAPI Service\n(Port 8000)"]
        XGBoostModel["XGBoost / RandomForest Models\n(Wait Time, Recommendations, Peak Hours)"]
    end

    subgraph DataStoreLayer ["Data & Caching Layer"]
        PostgreSQL[("PostgreSQL 16 + PostGIS\nGeospatial Spatial Indexes")]
        RedisCache[("Redis Server 7.2\nSession & Live Slot Caching")]
    end

    ClientLayer -->|HTTPS / WSS| Nginx
    Nginx -->|Proxy /api| DotNetAPI
    Nginx -->|Proxy /hub| SignalRHub
    Nginx -->|Proxy /| WebClient

    DotNetAPI -->|EF Core Spatial Queries| PostgreSQL
    DotNetAPI -->|Distributed Cache| RedisCache
    DotNetAPI -->|REST API Client| FastAPI
    SignalRHub -->|Pub/Sub Events| RedisCache

    FastAPI -->|Load .joblib Models| XGBoostModel
```

---

## 2. Low-Level Component Architecture (Clean Architecture)

```mermaid
graph TD
    subgraph PresentationLayer ["ChargeWise.API"]
        Controllers["Controllers\n(Auth, Stations, Bookings, Route, ML, Admin)"]
        Middleware["Global Exception & Rate Limiting Middleware"]
        SignalRHubs["StationHub (Real-Time Websockets)"]
    end

    subgraph CoreLayer ["ChargeWise.Core (Domain)"]
        Entities["Domain Entities\n(User, Station, Charger, Booking, Payment, Review)"]
        Interfaces["Interfaces\n(IRepository, IMLService, IAuthService)"]
        DTOs["Data Transfer Objects (DTOs)"]
    end

    subgraph InfrastructureLayer ["ChargeWise.Infrastructure"]
        DbContext["ChargeWiseDbContext (EF Core + Npgsql.Spatial)"]
        Repositories["Repositories Implementation"]
        Services["Services Implementation\n(BookingService, MLIntegrationService, RoutePlanner)"]
        RedisCacheImpl["RedisCacheService"]
    end

    PresentationLayer --> CoreLayer
    InfrastructureLayer --> CoreLayer
    PresentationLayer --> InfrastructureLayer
```

---

## 3. Data Flow Overview

1. **Station Location & Geospatial Search**: User sends current coordinates `(lat, lng, radius)`. `StationsController` invokes `IStationRepository` which uses PostGIS `ST_DWithin` spatial query.
2. **Machine Learning Predictions**: `StationsController` requests ML forecasts from `MLIntegrationService`. ASP.NET Core dispatches HTTP POST to Python FastAPI `/predict/waiting-time` and `/recommend/stations`.
3. **Double Booking Prevention**: `BookingService` executes atomic slot availability checks using Redis distributed locks and database transaction isolation levels.
4. **Real-time Availability Push**: Upon slot confirmation or cancellation, `StationHub` broadcasts updated charger availability to all connected Leaflet map clients.
