// ============================================================
//  VIVAHA VENUE — Node.js Backend Server
//  Run:  node server.js
//  All user signups, logins, bookings go into your SQL database
// ============================================================

require('dotenv').config();
const express  = require('express');
const mysql    = require('mysql2/promise');
const bcrypt   = require('bcryptjs');
const cors     = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());               // allow your HTML file to call this server
app.use(express.json());       // parse JSON request bodies
app.use(express.static('.'));  // serve your HTML file from this folder

// ── Database Connection Pool ────────────────────────────────
const db = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: '1234',
    database: process.env.DB_NAME     || 'vivaha_venue',
    waitForConnections: true,
    connectionLimit:    10,
});

// Test DB connection on startup
db.getConnection()
    .then(conn => { console.log('✅ Connected to MySQL database'); conn.release(); })
    .catch(err  => console.error('❌ DB connection failed:', err.message));


// ============================================================
//  AUTH ROUTES
// ============================================================

// ── SIGN UP ─────────────────────────────────────────────────
// Called when user fills Sign Up form in the app
// Saves: full_name, email, phone, password (hashed) → users table
app.post('/api/signup', async (req, res) => {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    try {
        // Check if email already exists
        const [existing] = await db.query(
            'SELECT id FROM users WHERE email = ?', [email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        // Hash the password before saving
        const password_hash = await bcrypt.hash(password, 10);

        // Insert into users table
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
            [full_name, email, phone || null, password_hash]
        );

        console.log(`📝 New user signed up: ${full_name} (${email})`);

        res.status(201).json({
            success: true,
            user: { id: result.insertId, full_name, email, phone }
        });

    } catch (err) {
        console.error('Signup error:', err.message);
        res.status(500).json({ error: 'Server error during signup.' });
    }
});


// ── SIGN IN ─────────────────────────────────────────────────
// Called when user fills Sign In form in the app
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?', [email]
        );
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        console.log(`🔑 User logged in: ${user.full_name} (${user.email})`);

        res.json({
            success: true,
            user: {
                id:        user.id,
                full_name: user.full_name,
                email:     user.email,
                phone:     user.phone
            }
        });

    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Server error during login.' });
    }
});


// ── UPDATE PROFILE ──────────────────────────────────────────
app.put('/api/users/:id', async (req, res) => {
    const { full_name, email, phone } = req.body;
    const userId = req.params.id;

    try {
        await db.query(
            'UPDATE users SET full_name = ?, email = ?, phone = ?, updated_at = NOW() WHERE id = ?',
            [full_name, email, phone || null, userId]
        );
        console.log(`✏️  Profile updated for user ID: ${userId}`);
        res.json({ success: true });
    } catch (err) {
        console.error('Profile update error:', err.message);
        res.status(500).json({ error: 'Could not update profile.' });
    }
});


// ============================================================
//  BOOKING ROUTES
// ============================================================

// ── CREATE BOOKING ───────────────────────────────────────────
// Called when user taps "Pay & Confirm" in the booking flow
// Saves full booking details into the bookings table
app.post('/api/bookings', async (req, res) => {
    const {
        user_id, venue_id, guest_name, guest_phone,
        event_date, occasion, guest_count, price_full
    } = req.body;

    if (!venue_id || !guest_name || !event_date || !occasion || !guest_count || !price_full) {
        return res.status(400).json({ error: 'Missing required booking fields.' });
    }

    try {
        // Calculate amounts
        const advance_paid    = Math.round(price_full * 0.30);
        const platform_fee    = Math.round(price_full * 0.02);
        const total_paid      = advance_paid + platform_fee;
        const balance_at_hall = Math.round(price_full * 0.70);

        // Generate reference ID like KH-241001
        const ref_id = 'KH-' + Date.now().toString().slice(-6);

        const [result] = await db.query(
            `INSERT INTO bookings
             (ref_id, user_id, venue_id, guest_name, guest_phone,
              event_date, occasion, guest_count, status,
              price_full, advance_paid, platform_fee, total_paid, balance_at_hall)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, ?)`,
            [
                ref_id,
                user_id || null,
                venue_id,
                guest_name,
                guest_phone,
                event_date,
                occasion,
                guest_count,
                price_full,
                advance_paid,
                platform_fee,
                total_paid,
                balance_at_hall
            ]
        );

        console.log(`🎉 New booking: ${ref_id} — ${guest_name} at venue ${venue_id} on ${event_date}`);

        res.status(201).json({
            success:        true,
            ref_id:         ref_id,
            booking_id:     result.insertId,
            advance_paid:   advance_paid,
            platform_fee:   platform_fee,
            total_paid:     total_paid,
            balance_at_hall: balance_at_hall
        });

    } catch (err) {
        console.error('Booking error:', err.message);
        res.status(500).json({ error: 'Could not create booking.' });
    }
});


// ── GET ALL BOOKINGS FOR A USER ──────────────────────────────
// Called when user opens the Bookings tab
app.get('/api/bookings/user/:userId', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT b.*, v.name AS venue_name, v.location AS venue_location, v.city
             FROM bookings b
             LEFT JOIN venues v ON b.venue_id = v.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [req.params.userId]
        );
        res.json({ success: true, bookings: rows });
    } catch (err) {
        console.error('Fetch bookings error:', err.message);
        res.status(500).json({ error: 'Could not fetch bookings.' });
    }
});


// ── CANCEL BOOKING ───────────────────────────────────────────
app.put('/api/bookings/:refId/cancel', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM bookings WHERE ref_id = ?', [req.params.refId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        const booking       = rows[0];
        const penalty       = Math.round(booking.advance_paid * 0.05);
        const refund_amount = Math.max(0, booking.advance_paid - penalty - booking.platform_fee);

        await db.query(
            `UPDATE bookings
             SET status = 'cancelled', cancelled_at = NOW(),
                 cancel_penalty = ?, refund_amount = ?, updated_at = NOW()
             WHERE ref_id = ?`,
            [penalty, refund_amount, req.params.refId]
        );

        console.log(`❌ Booking cancelled: ${req.params.refId} — refund ₹${refund_amount}`);

        res.json({ success: true, refund_amount, penalty });

    } catch (err) {
        console.error('Cancel error:', err.message);
        res.status(500).json({ error: 'Could not cancel booking.' });
    }
});


// ============================================================
//  VENUE ROUTES
// ============================================================

// ── GET ALL VENUES ───────────────────────────────────────────
app.get('/api/venues', async (req, res) => {
    try {
        const { city, min_price, max_price } = req.query;
        let query  = 'SELECT * FROM venues WHERE is_active = TRUE';
        const params = [];

        if (city)      { query += ' AND city = ?';                    params.push(city); }
        if (min_price) { query += ' AND price_per_day >= ?';          params.push(min_price); }
        if (max_price) { query += ' AND price_per_day <= ?';          params.push(max_price); }

        query += ' ORDER BY rating DESC';

        const [rows] = await db.query(query, params);
        res.json({ success: true, venues: rows });
    } catch (err) {
        console.error('Fetch venues error:', err.message);
        res.status(500).json({ error: 'Could not fetch venues.' });
    }
});


// ============================================================
//  SAVED VENUES ROUTES
// ============================================================

// ── SAVE A VENUE (heart/favourite) ──────────────────────────
app.post('/api/saved', async (req, res) => {
    const { user_id, venue_id } = req.body;
    try {
        await db.query(
            'INSERT IGNORE INTO saved_venues (user_id, venue_id) VALUES (?, ?)',
            [user_id, venue_id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Could not save venue.' });
    }
});

// ── UNSAVE A VENUE ───────────────────────────────────────────
app.delete('/api/saved', async (req, res) => {
    const { user_id, venue_id } = req.body;
    try {
        await db.query(
            'DELETE FROM saved_venues WHERE user_id = ? AND venue_id = ?',
            [user_id, venue_id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Could not unsave venue.' });
    }
});

// ── GET ALL SAVED VENUES FOR A USER ─────────────────────────
app.get('/api/saved/:userId', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT v.* FROM saved_venues s
             JOIN venues v ON s.venue_id = v.id
             WHERE s.user_id = ?`,
            [req.params.userId]
        );
        res.json({ success: true, saved: rows });
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch saved venues.' });
    }
});


// ============================================================
//  START SERVER
// ============================================================
app.listen(PORT, () => {
    console.log(`\n🚀 Vivaha Venue server running at http://localhost:${PORT}`);
    console.log(`📋 API endpoints ready:`);
    console.log(`   POST   /api/signup`);
    console.log(`   POST   /api/login`);
    console.log(`   PUT    /api/users/:id`);
    console.log(`   POST   /api/bookings`);
    console.log(`   GET    /api/bookings/user/:userId`);
    console.log(`   PUT    /api/bookings/:refId/cancel`);
    console.log(`   GET    /api/venues`);
    console.log(`   POST   /api/saved`);
    console.log(`   DELETE /api/saved`);
    console.log(`   GET    /api/saved/:userId\n`);
});
