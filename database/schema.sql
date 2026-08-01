-- ChargeWise AI - PostGIS Database Schema Definition

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'User',
    vehicle_model VARCHAR(100),
    battery_capacity_kwh INT DEFAULT 60,
    preferred_connector VARCHAR(30) DEFAULT 'CCS2',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stations Table
CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.50,
    total_chargers INT NOT NULL DEFAULT 4,
    available_chargers INT NOT NULL DEFAULT 4,
    price_per_kwh NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    operator_name VARCHAR(100) DEFAULT 'ChargeWise Network',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stations_location ON stations USING GIST (location);

-- Chargers Table
CREATE TABLE chargers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    serial_number VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(30) NOT NULL, -- CCS2, Type2, CHAdeMO, Supercharger
    max_power_kw NUMERIC(5, 2) NOT NULL, -- e.g. 50, 150, 350
    status VARCHAR(30) NOT NULL DEFAULT 'Available', -- Available, Occupied, Maintenance
    price_rate NUMERIC(5, 2) NOT NULL
);

CREATE INDEX idx_chargers_station ON chargers(station_id);

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    charger_id UUID NOT NULL REFERENCES chargers(id) ON DELETE CASCADE,
    station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_cost NUMERIC(8, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Confirmed', -- Pending, Confirmed, Cancelled, Completed
    qr_code_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_charger_time ON bookings(charger_id, start_time, end_time);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(8, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'CreditCard',
    status VARCHAR(30) NOT NULL DEFAULT 'Success',
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ML Prediction Logs
CREATE TABLE ml_prediction_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    station_id UUID REFERENCES stations(id) ON DELETE SET NULL,
    predicted_wait_minutes NUMERIC(5, 2),
    recommendation_score NUMERIC(5, 2),
    accuracy_metric NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
