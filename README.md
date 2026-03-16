# Guard Portal

A full-stack security guard management system.

## Live Demo
https://guard-portal.onrender.com

## Features
- Session-based authentication with bcrypt password hashing
- Role-based access control (Guard / Admin)
- Day off request and approval workflow
- Clock in / clock out with live timer and hours tracking
- Weekly schedule with approved days off removed automatically
- Admin panel — manage guards, sites, timecards and requests
- Rate limiting, input sanitization, and form validation

## Tech Stack
Node.js · Express.js · MongoDB Atlas · Mongoose · EJS · Bootstrap 5

## Run Locally
1. Clone the repo
2. Run `npm install`
3. Create `.env` with `MONGO_URI` and `SESSION_SECRET`
4. Run `node app.js`
