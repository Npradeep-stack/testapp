-- ============================================================
--  VIVAHA VENUE — Full Database Schema + Seed Data
--  Compatible with: MySQL 8+ / PostgreSQL 13+ / Supabase
--  Run this file once to set up the entire backend
-- ============================================================

-- ============================================================
--  1. USERS TABLE
--  Stores registered accounts (matches Login/Signup modal)
-- ============================================================
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    full_name     VARCHAR(120)        NOT NULL,
    email         VARCHAR(255)        NOT NULL UNIQUE,
    phone         VARCHAR(20),
    password_hash VARCHAR(255)        NOT NULL,   -- store bcrypt hash, never plain text
    created_at    TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  2. VENUES TABLE
--  Stores all venue listings shown in the app
-- ============================================================
CREATE TABLE venues (
    id            SERIAL PRIMARY KEY,
    venue_key     VARCHAR(20)         NOT NULL UNIQUE,  -- e.g. 'v1', 'v2'
    name          VARCHAR(200)        NOT NULL,
    location      VARCHAR(255)        NOT NULL,
    city          VARCHAR(100)        NOT NULL,
    tag           VARCHAR(50),                          -- ULTRA LUXE, VERIFIED, etc.
    price_per_day INTEGER             NOT NULL,         -- stored in rupees, e.g. 450000
    rating        DECIMAL(2,1)        DEFAULT 0.0,
    review_count  INTEGER             DEFAULT 0,
    capacity      INTEGER             DEFAULT 0,
    image_url     TEXT,
    description   TEXT,
    is_active     BOOLEAN             DEFAULT TRUE,
    created_at    TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  3. BOOKINGS TABLE
--  Every booking made through the app
-- ============================================================
CREATE TABLE bookings (
    id              SERIAL PRIMARY KEY,
    ref_id          VARCHAR(20)     NOT NULL UNIQUE,    -- e.g. KH-241001
    user_id         INTEGER         REFERENCES users(id) ON DELETE SET NULL,
    venue_id        INTEGER         REFERENCES venues(id) ON DELETE SET NULL,
    guest_name      VARCHAR(120)    NOT NULL,
    guest_phone     VARCHAR(20)     NOT NULL,
    event_date      DATE            NOT NULL,
    occasion        VARCHAR(100)    NOT NULL,           -- Wedding, Reception, etc.
    guest_count     INTEGER         NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'confirmed'
                                    CHECK (status IN ('confirmed','pending','completed','cancelled')),
    price_full      INTEGER         NOT NULL,           -- full hall cost in rupees
    advance_paid    INTEGER         NOT NULL,           -- 30% of price_full
    platform_fee    INTEGER         NOT NULL,           -- 2% of price_full
    total_paid      INTEGER         NOT NULL,           -- advance_paid + platform_fee
    balance_at_hall INTEGER         NOT NULL,           -- 70% of price_full
    cancelled_at    TIMESTAMP,
    cancel_penalty  INTEGER         DEFAULT 0,
    refund_amount   INTEGER         DEFAULT 0,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  4. SAVED VENUES TABLE
--  Tracks which venues each user has favourited (heart icon)
-- ============================================================
CREATE TABLE saved_venues (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    venue_id   INTEGER     NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    saved_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, venue_id)
);

-- ============================================================
--  5. REVIEWS TABLE
--  Future use — ratings left by users after completed events
-- ============================================================
CREATE TABLE reviews (
    id          SERIAL PRIMARY KEY,
    booking_id  INTEGER         REFERENCES bookings(id) ON DELETE SET NULL,
    user_id     INTEGER         REFERENCES users(id) ON DELETE SET NULL,
    venue_id    INTEGER         NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    rating      DECIMAL(2,1)    NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment     TEXT,
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  INDEXES — for fast lookups
-- ============================================================
CREATE INDEX idx_bookings_user_id    ON bookings(user_id);
CREATE INDEX idx_bookings_venue_id   ON bookings(venue_id);
CREATE INDEX idx_bookings_status     ON bookings(status);
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_saved_user_id       ON saved_venues(user_id);
CREATE INDEX idx_venues_city         ON venues(city);
CREATE INDEX idx_venues_price        ON venues(price_per_day);

-- ============================================================
--  SEED DATA — Venues (matches app's venues object)
-- ============================================================
INSERT INTO venues (venue_key, name, location, city, tag, price_per_day, rating, review_count, capacity, image_url, description) VALUES

('v1',
 'V Convention Center',
 'Benz Circle, Vijayawada',
 'Vijayawada',
 'ULTRA LUXE',
 450000,
 4.9,
 284,
 1200,
 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900',
 'A premier landmark in Vijayawada featuring grand air-conditioned halls, world-class décor, and full catering arrangements. Perfect for royal Telugu weddings and high-profile receptions.'),

('v2',
 'River Bay Resort',
 'Godavari Bank, Rajahmundry',
 'Rajahmundry',
 'VERIFIED',
 220000,
 4.7,
 172,
 600,
 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900',
 'Nestled on the scenic Godavari riverbank, River Bay Resort offers a breathtaking outdoor setting for your wedding celebrations with curated floral décor and riverside dining.'),

('v3',
 'Grand Elite Gardens',
 'Madhapur, Hyderabad',
 'Hyderabad',
 'POPULAR',
 500000,
 4.8,
 319,
 1500,
 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900',
 'Hyderabad''s most sought-after wedding garden. Lush landscaped grounds, multiple banquet halls, premium in-house catering, and expert event planning for the celebration of a lifetime.'),

('v4',
 'S Convention',
 'Main Road, Kakinada',
 'Kakinada',
 'ELITE',
 180000,
 4.6,
 98,
 400,
 'https://images.unsplash.com/photo-1544161513-0179fe746fd5?w=900',
 'A beautifully decorated convention hall in the heart of Kakinada. Ideal for intimate weddings and family events with personalized service and affordable elegance.');

-- ============================================================
--  SEED DATA — Sample Users (passwords are placeholders)
--  In production replace password_hash with real bcrypt hashes
-- ============================================================
INSERT INTO users (full_name, email, phone, password_hash) VALUES
('Ravi Shankar',    'ravi.shankar@gmail.com',  '+91 9876543210', '$2b$10$PLACEHOLDER_HASH_RAVI'),
('Priya Reddy',     'priya.reddy@gmail.com',   '+91 9845678901', '$2b$10$PLACEHOLDER_HASH_PRIYA'),
('Arjun Naidu',     'arjun.naidu@gmail.com',   '+91 9912345678', '$2b$10$PLACEHOLDER_HASH_ARJUN');

-- ============================================================
--  SEED DATA — Sample Bookings (matches app's myBookings array)
-- ============================================================
INSERT INTO bookings (ref_id, user_id, venue_id, guest_name, guest_phone, event_date, occasion, guest_count, status, price_full, advance_paid, platform_fee, total_paid, balance_at_hall) VALUES

('KH-241001',
 1,                          -- Ravi Shankar
 1,                          -- V Convention Center
 'Ravi Shankar',
 '+91 9876543210',
 '2025-06-14',
 'Wedding',
 500,
 'confirmed',
 450000,
 135000,                     -- 30% advance
 9000,                       -- 2% platform fee
 144000,                     -- total paid online
 315000),                    -- 70% balance at hall

('KH-241002',
 1,                          -- Ravi Shankar
 2,                          -- River Bay Resort
 'Ravi Shankar',
 '+91 9876543210',
 '2025-08-28',
 'Reception',
 300,
 'pending',
 220000,
 66000,
 4400,
 70400,
 154000),

('KH-240001',
 1,                          -- Ravi Shankar
 3,                          -- Grand Elite Gardens
 'Ravi Shankar',
 '+91 9876543210',
 '2025-01-02',
 'Wedding',
 700,
 'completed',
 500000,
 150000,
 10000,
 160000,
 350000);

-- ============================================================
--  USEFUL QUERIES
-- ============================================================

-- Get all bookings for a user with venue name:
-- SELECT b.*, v.name AS venue_name, v.city
-- FROM bookings b
-- JOIN venues v ON b.venue_id = v.id
-- WHERE b.user_id = 1
-- ORDER BY b.created_at DESC;

-- Get active (confirmed + pending) booking count for a user:
-- SELECT COUNT(*) FROM bookings
-- WHERE user_id = 1 AND status IN ('confirmed', 'pending');

-- Get all saved venues for a user:
-- SELECT v.* FROM saved_venues s
-- JOIN venues v ON s.venue_id = v.id
-- WHERE s.user_id = 1;

-- Search venues by city:
-- SELECT * FROM venues WHERE city = 'Hyderabad' AND is_active = TRUE;

-- Filter venues by price range:
-- SELECT * FROM venues WHERE price_per_day BETWEEN 200000 AND 500000;

-- Cancel a booking and record refund:
-- UPDATE bookings
-- SET status = 'cancelled',
--     cancelled_at = CURRENT_TIMESTAMP,
--     cancel_penalty = ROUND(advance_paid * 0.05),
--     refund_amount = advance_paid - ROUND(advance_paid * 0.05) - platform_fee
-- WHERE ref_id = 'KH-241001';

-- ============================================================
--  END OF FILE
-- ============================================================
