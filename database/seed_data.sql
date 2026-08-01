-- ChargeWise AI - Realistic Seed Data Script

-- Admin & Standard Users
INSERT INTO users (id, full_name, email, password_hash, role, vehicle_model, battery_capacity_kwh, preferred_connector) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Supervisor', 'admin@chargewise.ai', 'AQAAAAIAAYagAAAAEJzRz...', 'Admin', 'Tesla Model Y', 75, 'CCS2'),
('22222222-2222-2222-2222-222222222222', 'Alex Mercer', 'alex.mercer@gmail.com', 'AQAAAAIAAYagAAAAEJzRz...', 'User', 'Hyundai Ioniq 5', 77, 'CCS2'),
('33333333-3333-3333-3333-333333333333', 'Sophia Chen', 'sophia.chen@tech.io', 'AQAAAAIAAYagAAAAEJzRz...', 'User', 'Tata Nexon EV', 40, 'Type2');

-- EV Charging Stations
INSERT INTO stations (id, name, address, location, rating, total_chargers, available_chargers, price_per_kwh, operator_name) VALUES
('a1111111-1111-1111-1111-111111111111', 'Downtown Supercharge Hub', '742 Evergreen Terrace, Central District', ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326), 4.85, 6, 4, 18.50, 'ChargeWise Ultra'),
('a2222222-2222-2222-2222-222222222222', 'Tech Park Fast Charging Grid', '100 Innovation Blvd, Silicon Square', ST_SetSRID(ST_MakePoint(77.6387, 12.9352), 4326), 4.70, 8, 5, 16.00, 'GreenGrid Power'),
('a3333333-3333-3333-3333-333333333333', 'Airport Express Charge Plaza', 'Terminal 2 Outer Circle, International Airport', ST_SetSRID(ST_MakePoint(77.7068, 13.1986), 4326), 4.90, 10, 8, 22.00, 'AeroCharge India'),
('a4444444-4444-4444-4444-444444444444', 'Metro Station EV Station', 'Platform 1 Entrance, Mg Road Metro', ST_SetSRID(ST_MakePoint(77.6094, 12.9756), 4326), 4.40, 4, 2, 14.00, 'CityCharge Express'),
('a5555555-5555-5555-5555-555555555555', 'Suburban EcoCharge Depot', 'Sector 4 Ring Road, North Suburbs', ST_SetSRID(ST_MakePoint(77.5500, 13.0300), 4326), 4.60, 6, 6, 12.50, 'EcoVolt Systems');

-- Chargers
INSERT INTO chargers (id, station_id, serial_number, type, max_power_kw, status, price_rate) VALUES
-- Downtown Hub
('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'CW-DT-01', 'Supercharger', 250.0, 'Available', 18.50),
('c1111111-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'CW-DT-02', 'CCS2', 150.0, 'Occupied', 18.50),
('c1111111-1111-1111-1111-111111111113', 'a1111111-1111-1111-1111-111111111111', 'CW-DT-03', 'CCS2', 150.0, 'Available', 18.50),
('c1111111-1111-1111-1111-111111111114', 'a1111111-1111-1111-1111-111111111111', 'CW-DT-04', 'Type2', 50.0, 'Available', 14.00),
-- Tech Park
('c2222222-2222-2222-2222-222222222221', 'a2222222-2222-2222-2222-222222222222', 'CW-TP-01', 'CCS2', 150.0, 'Available', 16.00),
('c2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'CW-TP-02', 'CHAdeMO', 60.0, 'Occupied', 16.00),
('c2222222-2222-2222-2222-222222222223', 'a2222222-2222-2222-2222-222222222222', 'CW-TP-03', 'Type2', 22.0, 'Available', 12.00);

-- Reviews
INSERT INTO reviews (id, station_id, user_id, rating, comment) VALUES
(uuid_generate_v4(), 'a1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 5, 'Superfast charging! Reached 80% in just 18 minutes.'),
(uuid_generate_v4(), 'a2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 4, 'Clean lounge nearby and easy slot booking through the app.');
