# Vivaha Venue — Backend Setup Guide

Follow these steps exactly and your HTML app will save all user
signups, logins, and bookings directly into your SQL database.

---

## STEP 1 — Install Node.js
Download from: https://nodejs.org  (choose the LTS version)
After installing, open a terminal and check it works:
  node --version
  npm --version

---

## STEP 2 — Install MySQL
Download from: https://dev.mysql.com/downloads/mysql/
After installing, open MySQL and create the database:
  CREATE DATABASE vivaha_venue;

Then run the SQL file to create all tables:
  mysql -u root -p vivaha_venue < vivaha_venue.sql

---

## STEP 3 — Set up this backend folder
Open a terminal inside this folder (vivaha-backend) and run:
  npm install

This installs express, mysql2, bcryptjs, cors, dotenv.

---

## STEP 4 — Configure your database credentials
Copy the example env file:
  cp .env.example .env

Open .env and fill in your MySQL password:
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=your_actual_mysql_password
  DB_NAME=vivaha_venue
  PORT=3000

---

## STEP 5 — Place your HTML file here
Copy kalyanam-hub-fixed.html into this same folder.
Rename it to index.html so the server serves it automatically.

---

## STEP 6 — Start the server
  node server.js

You should see:
  ✅ Connected to MySQL database
  🚀 Vivaha Venue server running at http://localhost:3000

---

## STEP 7 — Open the app
Open your browser and go to:
  http://localhost:3000

Now when a user signs up, logs in, or makes a booking —
it goes straight into your MySQL database.

---

## HOW TO SEE THE DATA IN YOUR DATABASE

Open MySQL and run:

  -- See all registered users:
  SELECT id, full_name, email, phone, created_at FROM users;

  -- See all bookings:
  SELECT ref_id, guest_name, occasion, event_date, status, total_paid
  FROM bookings ORDER BY created_at DESC;

  -- See bookings with venue names:
  SELECT b.ref_id, b.guest_name, v.name AS venue, b.event_date, b.status
  FROM bookings b JOIN venues v ON b.venue_id = v.id;

---

## API ENDPOINTS SUMMARY

  POST   /api/signup              → Register new user
  POST   /api/login               → Login existing user
  PUT    /api/users/:id           → Update profile
  POST   /api/bookings            → Create new booking
  GET    /api/bookings/user/:id   → Get all bookings for a user
  PUT    /api/bookings/:refId/cancel → Cancel a booking
  GET    /api/venues              → Get all venues (filter by city/price)
  POST   /api/saved               → Save a venue (heart icon)
  DELETE /api/saved               → Unsave a venue
  GET    /api/saved/:userId       → Get saved venues for a user

---

## TO RUN IN DEVELOPMENT (auto-restart on save)
  npm run dev
