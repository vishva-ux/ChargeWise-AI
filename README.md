# ⚡ ChargeWise - Smart EV Charging Station Locator, AI Route Planning & Rapido-Style Slot Booking

[![React 18](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Leaflet.js](https://img.shields.io/badge/Leaflet-1.9-green.svg)](https://leafletjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)](https://spring.io/)
[![PostGIS](https://img.shields.io/badge/PostgreSQL-PostGIS-336791.svg)](https://postgis.net/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**ChargeWise** is a full-stack, mobile-first EV station locator, intelligent AI route planner, and slot booking web application inspired by the sleek design language of the **Rapido app** combined with a soft, clean **Headspace-style pastel mint aesthetic**.

---

## 🎨 Mobile Interface & UI Features

- **Centered Mobile Viewport Frame (440px):** Desktop screens display a sleek, centered mobile canvas container bounded by drop shadow accents (`mobile-canvas-frame`), with full-bleed styling on native mobile viewports.
- **Rapido Floating Header (`RapidoHeader.tsx`):** Clean **ChargeWise** branding, active EV Fleet Wallet Balance (`₹2,450.00`), notification bell indicator with unread pulse badge, and driver profile button.
- **Stacked Route Search Indicator (`RapidoSearchModule.tsx`):** Features a green circular dot (*Current Location*) linked via a vertical connector line to a dark location pin connected to an **AI Prompt Input Field** (supports natural language queries like *"Driving fleet EV from Chennai to Bangalore with 30% battery..."*).
- **Persistent Leaflet Map (`StationMap.tsx`):** Interactive map with custom color-coded pins (Dark Slate for 120kW+ CCS2 Fast Chargers, Emerald Green for Type 2 AC Chargers, GPS pulse pin for user location).
- **Sliding 3-Panel Bottom Sheet (`RapidoBottomSheet.tsx`):**
  - **Panel A (Discovery View):** Nearby station horizontal carousel with distance metrics, AI-predicted wait time badges (`⚡ ~4m wait`), and dark slate `"BOOK SLOT"` buttons.
  - **Panel B (Rapido Checkout Interface):** Itemized fee breakdown (Base reservation charge ₹49 + Estimated charging tariff ₹180), payment selection radio group matching Rapido (**UPI Google Pay/PhonePe**, **EV Fleet Wallet Balance ₹2,450.00**, **Credit/Debit Card**), and full-width button `"PROCEED TO SECURE RESERVATION"`.
  - **Panel C (Fake QR Code & Secure Pass Generation):** Redisson-style atomic lock simulation, animated green checkmark (*"Booking Confirmed!"*), realistic QR Code matrix graphic enclosed in reticle targeting brackets, Pass ID metadata (`CW-PASS-8942`), and kiosk scan status indicator.
- **Rapido-Style OTP Auth System (`RapidoLoginModal.tsx`):** Phone number input (+91 India), Vehicle type selector (EV Fleet Cab, EV Car, EV 2-Wheeler), 4-digit OTP verification code screen, and account profile drawer (`RapidoProfileModal.tsx`).
- **Interactive Notifications Drawer (`RapidoNotificationsModal.tsx`):** Displays live fleet discount notifications, highway corridor statuses, and battery level alerts.

---

## 🧠 LLM (Large Language Model) Integration Architecture

The application utilizes an LLM orchestration pipeline (LangChain.js / OpenAI) within the Node.js AI Gateway:

1. **Conversational Intent & Parameter Extraction (Zod Function Calling):**
   Translates raw driver prompts (e.g., *"Driving fleet EV from Chennai to Bangalore starting with 30% battery..."*) into structured parameters:
   ```json
   {
     "startLocation": "Chennai",
     "destination": "Bangalore",
     "currentBatteryPercentage": 30,
     "preferredChargerType": "CCS2 Fast"
   }
   ```
2. **PostGIS Geospatial Corridor Query:**
   Passes extracted JSON parameters to PostGIS (`ST_DWithin`) to filter operational charging hubs along highway corridors.
3. **Predictive Station Queue Wait-Times:**
   Predicts real-time queue delays based on historical congestion.
4. **Driver Log & Amenity Summaries (pgvector RAG):**
   Synthesizes driver feedback and station amenities into actionable summaries.

---

## 📐 Unified Technology Stack

| Layer | Technology Used | Role in Workflow |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite, TypeScript, Tailwind CSS | Centered 440px mobile canvas container, Leaflet background map, Rapido bottom sheet. |
| **UI Icons & QR** | Lucide React, QRCode.react | Vector iconography, interactive QR matrix generator with reticle scanner. |
| **AI Gateway** | Node.js (TypeScript), LangChain.js, Zod | Intent parsing, Zod tool-calling parameter extraction, RAG semantic search. |
| **Core Backend** | Java 21 / Spring Boot 3 | Enterprise transaction processing, high-speed PostGIS spatial queries. |
| **Concurrency Safeguard**| Redis & Redisson client | Distributed locking to prevent double-booking race conditions on charging terminals. |
| **Database Core** | PostgreSQL 16 + PostGIS + pgvector | Spatial indexing & 1536-dimensional vector embedding storage for driver logs. |

---

## 🛠️ Quick Start & How to Run on Mac

### 1. Prerequisites
- Node.js 18+ installed on your Mac (`node -v`)
- npm package manager (`npm -v`)

### 2. Step-by-Step Launch Commands

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/vishva-ux/ChargeWise-AI.git
   cd ChargeWise-AI
   ```

2. **Navigate to Frontend Directory & Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Access in Browser:**
   Open your browser and navigate to: **[http://localhost:3001/](http://localhost:3001/)** (or `http://localhost:3000/`).

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
ChargeWise-AI/
├── frontend/                     # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Rapido Header, Search Module, Bottom Sheet, Map, Auth Modals
│   │   │   ├── RapidoHeader.tsx
│   │   │   ├── RapidoSearchModule.tsx
│   │   │   ├── RapidoBottomSheet.tsx
│   │   │   ├── RapidoLoginModal.tsx
│   │   │   ├── RapidoProfileModal.tsx
│   │   │   ├── RapidoNotificationsModal.tsx
│   │   │   └── StationMap.tsx
│   │   ├── utils/
│   │   │   └── aiEngine.ts       # Zod Tool Calling, RAG Lookup & PostGIS station nodes
│   │   ├── App.tsx               # Main Mobile Frame Container Orchestrator
│   │   └── index.css             # Headspace/Rapido Mint Pastel Design System
│   ├── package.json
│   └── vite.config.ts
├── node-ai-gateway/              # Node.js Express + LangChain AI Gateway
├── core-backend-java/            # Java Spring Boot 3 + PostGIS Core Backend
├── database/                     # PostgreSQL + PostGIS + pgvector SQL Schemas
└── README.md
```

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).
