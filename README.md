# VELOOP Rewards Hub — Points, Rewards, Challenges & Achievements Platform

![Deployment](https://img.shields.io/badge/Vercel-Live%20Frontend-000000?style=for-the-badge&logo=vercel)
![Backend](https://img.shields.io/badge/Render-Live%20Backend-46E3B7?style=for-the-badge&logo=render)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Node.js%20%7C%20Express%20%7C%20MongoDB-green?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-JWT%20%7C%20Bcrypt%20%7C%20Server--Side%20Validation%20%7C%20Rate%20Limit-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 1. Project Overview

**VELOOP Rewards Hub** is a modern, full-stack points, rewards, daily challenges, and achievements platform designed like a modern fintech / SaaS product. Users earn VE Points through daily login streaks and platform challenges, track their level progression, compare rankings on privacy-masked leaderboards, unlock achievement badges, and redeem tech items & gift cards in the Rewards Store.

### Deployment Architecture
- **Frontend Layer**: React + Vite SPA deployed on **Vercel** (`/client` directory).
- **Backend Service**: Node.js + Express API server deployed on **Render** (`/server` directory).
- **Database Layer**: **MongoDB Atlas** cloud cluster storing user profiles, rewards inventory, challenges, achievements, notifications, and immutable transaction ledgers.

---

## 2. Core Platform Modules

### 1. Dashboard
- **Total VE Points**: Real-time points balance.
- **Level & XP Progress**: Level progress bar (`level * 500 XP` threshold).
- **Stat Cards**: Rewards Redeemed, Daily Challenges Completed, Active Login Streak Days.
- **Active Challenges Preview**: Quick-claim daily activities.
- **Featured Rewards Carousel**: Featured store items with instant redeem modal.
- **Points Activity Stream**: Ledger transaction activity feed.

### 2. Rewards Store
- **Store Catalog**: Physical tech items (iPhone 15 Pro, Samsung Galaxy S24 Ultra, Apple Watch Series 9, Wireless Earbuds, PS5) and Digital Gift Cards (Amazon, Apple).
- **Server-Side Validation**: Never trusts points, prices, or user balances from the frontend.
- **Redemption Flow**: Deducts VE Points, checks inventory stock, updates order status, generates digital codes for gift cards, and records transaction logs.

### 3. Daily & Weekly Challenges
- **Activity Challenges**: Daily Login (+50 pts), Profile Verification (+100 pts), Refer a Friend (+250 pts), Daily Activity (+150 pts), Store Redemption (+300 pts).
- **Server-Side Verification**: Prevents double-claiming rewards with unique user challenge tracking.

### 4. Leaderboard
- **Weekly & Monthly Rankings**: Top 50 members ranked by VE Points and level status.
- **Podium Showcase**: 🥇 1st Gold, 🥈 2nd Silver, 🥉 3rd Bronze podium cards.
- **Privacy Compliance**: Anonymizes member names (`AYU****92`) for identity protection.

### 5. Achievements
- **Milestone Badges**: *First Reward*, *7 Day Streak*, *1,000 Points Club*, *Challenge Master*, *Reward Collector*.
- **Unlocked vs Locked States**: Visual glowing badges, progress bars, and bonus points rewards.

### 6. Points Ledger & Transaction History
- **Immutable Ledger**: Detailed log of all earned, spent, daily bonus, challenge reward, achievement reward, and admin adjustment transactions.
- **Redemption Orders**: Track shipping status for physical rewards and view digital gift codes.

### 7. Profile & Account Settings
- Level & XP breakdown, active login streak, account role, and update profile form (name, avatar).

### 8. Notifications System
- In-app notification bell with unread badge counter for reward redemptions, challenge completions, points credits, and achievement unlocks.

### 9. Admin Dashboard
- **Overview Metrics**: Total Users, Total Rewards, Total Redemptions, Total Points Issued.
- **Inventory Management**: Create & edit rewards, update stock levels, manage item status.
- **Order Fulfillment**: Fulfill customer orders, assign digital gift card codes, update shipping statuses.
- **User Points Management**: Adjust user VE Points balances with audit trail reasons.

---

## 3. Technology Stack

- **Frontend**: React.js 18, Vite 5, Bootstrap 5, Lucide Icons, CSS Modules, React Router 6, Framer Motion.
- **Backend**: Node.js 20+, Express.js 4, Mongoose 8, JWT, Bcrypt.js, Helmet, CORS, Express-Rate-Limit.
- **Database**: MongoDB Atlas.

---

## 4. API Endpoints

### Health Check
- `GET /api/health` — Returns service & database status.

### Authentication
- `POST /api/auth/register` — Register user (+500 VE Points starter bonus).
- `POST /api/auth/login` — Sign in user & update daily streak.
- `GET /api/auth/me` — Fetch current profile.
- `PUT /api/auth/profile` — Update user profile name/avatar.
- `POST /api/auth/logout` — Invalidate session.

### Rewards Store
- `GET /api/rewards` — List rewards (with category/search filters).
- `GET /api/rewards/:id` — Single reward details.
- `POST /api/rewards/:id/redeem` — Redeem reward (Server-side point validation).

### Challenges
- `GET /api/challenges` — List challenges with user progress.
- `POST /api/challenges/:id/claim` — Claim challenge reward points.

### Leaderboard
- `GET /api/leaderboard` — Get weekly/monthly anonymized leaderboard.

### Achievements
- `GET /api/achievements` — Get user achievement badges & progress.

### Transactions & History
- `GET /api/transactions` — Get points ledger history.
- `GET /api/transactions/redemptions` — Get reward redemption orders.

### Notifications
- `GET /api/notifications` — Fetch user notifications & unread count.
- `PUT /api/notifications/:id/read` — Mark notification read.
- `PUT /api/notifications/read-all` — Mark all read.

### Admin Dashboard
- `GET /api/admin/stats` — Admin dashboard metrics.
- `POST /api/admin/rewards` — Create new reward.
- `PUT /api/admin/rewards/:id` — Edit reward / stock.
- `DELETE /api/admin/rewards/:id` — Delete reward.
- `GET /api/admin/redemptions` — All store redemptions.
- `PUT /api/admin/redemptions/:id/status` — Update order fulfillment status.
- `GET /api/admin/users` — All registered users.
- `POST /api/admin/users/:id/points` — Adjust user points.

---

## 5. Security Principles

1. **Never Trust Frontend Inputs**: Points, prices, balances, and user IDs are calculated and validated exclusively on the Express backend server.
2. **Double-Claim Prevention**: Unique compound indexes (`{ userId: 1, challengeId: 1 }`) and transactional checks prevent duplicate point claims.
3. **Inventory Race Condition Safeguard**: Atomic stock checks and Mongoose model updates prevent overselling rewards.
4. **Privacy Protection**: Anonymizes public leaderboard identities (`AYU****92`).
5. **Rate Limiting & Helmet**: Prevents API abuse and sets security headers.

---

## 6. License

Distributed under the MIT License.
