# ⚡ ChargeWise - Smart EV Charging Station Locator, AI Route Planning & Rapido-Style Slot Booking

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Leaflet.js](https://img.shields.io/badge/Leaflet-1.9-green.svg)](https://leafletjs.com/)
[![Java Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)](https://spring.io/)
[![Maven](https://img.shields.io/badge/Maven-3.9-orange.svg)](https://maven.apache.org/)
[![PostGIS](https://img.shields.io/badge/PostgreSQL-PostGIS-336791.svg)](https://postgis.net/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**ChargeWise** is an enterprise-grade, full-stack, mobile-first EV charging station locator, intelligent AI route planner, and slot booking web platform. Built with **Next.js 14 (App Router)** and inspired by the sleek design language of the **Rapido app** combined with a soft, clean **Headspace-style pastel mint aesthetic** (`#65C5B0`).

---

## 🎨 About The Project & Key Features

- **Next.js 14 App Router Architecture:** Utilizes React Server Components & Client Components (`src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`).
- **Centered Mobile Viewport Frame (440px):** Desktop viewports center a 440px mobile canvas container bounded by drop shadow accents (`mobile-canvas-frame`), with seamless full-bleed responsive layout on mobile screens.
- **Rapido Floating Header (`RapidoHeader.tsx`):** Clean **ChargeWise** branding, active EV Fleet Wallet Balance (`₹2,450.00`), notification bell indicator with unread pulse badge, and driver profile drawer button.
- **Stacked Route Search Indicator (`RapidoSearchModule.tsx`):** Features a green circular dot (*Current Location*) linked via a vertical connector line to a dark location pin connected to an **AI Prompt Input Field** (supports natural language queries like *"Driving fleet EV from Chennai to Bangalore with 30% battery..."*).
- **Persistent Interactive Leaflet Map (`StationMap.tsx`):** SSR-safe client-side dynamic map rendering custom color-coded pins (Dark Slate for 120kW+ CCS2 Fast Chargers, Emerald Green for Type 2 AC Chargers, GPS pulse pin for user location).
- **Sliding 3-Panel Bottom Sheet (`RapidoBottomSheet.tsx`):**
  - **Panel A (Discovery View):** Nearby station horizontal carousel with distance metrics, AI-predicted wait time badges (`⚡ ~4m wait`), and dark slate `"BOOK SLOT"` buttons.
  - **Panel B (Rapido Checkout Interface):** Itemized fee breakdown (Base reservation charge ₹49 + Estimated charging tariff ₹180), payment selection radio group matching Rapido (**UPI Google Pay/PhonePe**, **EV Fleet Wallet Balance ₹2,450.00**, **Credit/Debit Card**), and full-width button `"PROCEED TO SECURE RESERVATION"`.
  - **Panel C (Fake QR Code & Secure Pass Generation):** Redisson-style atomic lock simulation, animated green checkmark (*"Booking Confirmed!"*), realistic QR Code matrix graphic enclosed in reticle targeting brackets, Pass ID metadata (`CW-PASS-8942`), and kiosk scan status indicator.
- **Rapido-Style OTP Auth System (`RapidoLoginModal.tsx`):** Phone number input (+91 India), Vehicle type selector (EV Fleet Cab, EV Car, EV 2-Wheeler), 4-digit OTP verification code screen, and account profile drawer (`RapidoProfileModal.tsx`).
- **Interactive Notifications Drawer (`RapidoNotificationsModal.tsx`):** Displays live fleet discount notifications, highway corridor statuses, and battery level alerts.

---

## 🛠️ Complete Tech Stack Used

| Component Layer | Technology Used | Exact Role in Application |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14+ (App Router), React 18 | Serves the mobile-responsive canvas container, dynamic server/client components. |
| **Language & Styling** | TypeScript 5, Tailwind CSS 3.4 | Type safety, Headspace mint theme (`#65C5B0`), hardware-accelerated animations. |
| **Maps & Iconography** | Leaflet.js, Lucide React, QRCode.react | SSR-safe interactive Leaflet map, vector UI icons, QR pass matrix scanner. |
| **AI Gateway Service** | Node.js (v20+), Express.js, LangChain | Proxy server intercepting driver prompts, managing tool-calling & RAG lookup pipelines. |
| **LLM Engine** | OpenAI API (GPT-4o-mini), Zod Validation | Intent parsing & structured JSON parameter extraction (`startLocation`, `destination`, `currentBatteryPercentage`). |
| **Core Enterprise Backend** | Java 21, Spring Boot 3.2, Maven | Financial transactions, atomic slot reservations, spatial PostGIS calculations. |
| **Concurrency Safeguard** | Redis 7, Redisson Client (`RLock`) | Distributed locks preventing race conditions / double-bookings on charging nodes. |
| **Database & Vector Core** | PostgreSQL 16, PostGIS, `pgvector` | Spatial corridor queries (`ST_DWithin`) & 1536-dimensional vector embedding lookups. |

---

## 🚀 How to Run The Project on Mac

### 1. Prerequisites
- **Node.js 18+** installed (`node -v`)
- **Java 21 / OpenJDK** installed (`java -version`)
- **Apache Maven 3.9+** installed (`mvn -v`)

---

### 2. Step-by-Step Launch Commands

#### Option A: Run Next.js 14 Frontend (Port 3000)
Open a terminal window and execute:
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Launch Next.js development server
npm run dev
```
👉 Access in browser: **[http://localhost:3000/](http://localhost:3000/)**

To build for production:
```bash
npm run build
```

---

#### Option B: Run Java Spring Boot 3 Backend (Port 8080)
Open a second terminal window and execute:
```bash
# 1. Navigate to backend directory
cd backend

# 2. Compile & run Spring Boot Maven microservice
mvn spring-boot:run
```
👉 Access API endpoints at: **[http://localhost:8080/api/v1/stations/nearby](http://localhost:8080/api/v1/stations/nearby)**

---

#### Option C: Run Multi-Container Setup via Docker Compose
If Docker Desktop is installed on your Mac, launch all services with one command:
```bash
docker compose up --build
```

---

## 📂 Project Structure

```
ChargeWise-AI/
├── frontend/                     # Next.js 14 App Router Frontend
│   ├── src/
│   │   ├── app/                  # App Router (page.tsx, layout.tsx, globals.css)
│   │   ├── components/           # Header, Search Module, Bottom Sheet, Auth & Notification Modals
│   │   │   ├── RapidoHeader.tsx
│   │   │   ├── RapidoSearchModule.tsx
│   │   │   ├── RapidoBottomSheet.tsx
│   │   │   ├── RapidoLoginModal.tsx
│   │   │   ├── RapidoProfileModal.tsx
│   │   │   ├── RapidoNotificationsModal.tsx
│   │   │   └── StationMap.tsx
│   │   └── utils/
│   │       └── aiEngine.ts       # Zod Tool Calling, RAG Lookup & PostGIS station nodes
│   ├── package.json
│   └── postcss.config.js
├── backend/                      # Java 21 Spring Boot 3 + Maven microservice
│   ├── pom.xml                   # Maven build configuration
│   └── src/main/java/com/chargewise/
│       ├── ChargeWiseApplication.java
│       ├── controller/           # REST Controllers
│       ├── service/              # PostGIS Spatial & Redisson Locking Services
│       └── model/                # Entity DTO Models
├── node-ai-gateway/              # Node.js Express + LangChain AI Gateway
├── database/                     # PostgreSQL + PostGIS + pgvector SQL Schemas
└── README.md
```

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).
