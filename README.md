# 🚀 VELOOP Rewards Hub — Points, Rewards, Challenges & Achievements Platform

![Deployment](https://img.shields.io/badge/Vercel-Live%20Frontend-000000?style=for-the-badge&logo=vercel)
![Backend](https://img.shields.io/badge/Render-Live%20Backend-46E3B7?style=for-the-badge&logo=render)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Node.js%20%7C%20Express%20%7C%20MongoDB-green?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-JWT%20%7C%20Bcrypt%20%7C%20Server--Side%20Validation%20%7C%20Rate%20Limit-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## 🌐 Live Deployments
- **Frontend (Vercel)**: [https://veloop-rewards-so37.vercel.app](https://veloop-rewards-so37.vercel.app)
- **Source Code (GitHub)**: [https://github.com/ayushsinghtiwari144-rgb/veloops_rewards.xml](https://github.com/ayushsinghtiwari144-rgb/veloops_rewards.xml)

---

## 📌 1. Project Overview

**VELOOP Rewards** is a modern, responsive, and interactive full-stack rewards platform designed like a fintech / SaaS product. Users earn VE Points through daily login streaks and platform challenges, track their level progression, compare rankings on privacy-masked leaderboards, unlock achievement badges, enter live promotional giveaways, and redeem tech items & digital gift cards in the Rewards Store.

### Deployment Architecture
- **Frontend Layer**: React 18 + Vite SPA deployed on **Vercel** (`/client` directory).
- **Backend Service**: Node.js + Express API server deployed on **Render** (`/server` directory).
- **Database Layer**: **MongoDB Atlas** cloud cluster storing user profiles, rewards inventory, challenges, achievements, notifications, and immutable transaction ledgers.

---

## 🛠️ 2. Core Platform Modules

### 1. Dashboard (Command Center)
- **Total VE Points**: Real-time points balance counter.
- **Level & XP Progress**: Level progress bar (`level * 500 XP` threshold).
- **Quick Metrics**: Rewards Redeemed, Daily Challenges Completed, Active Login Streak Days.
- **Active Challenges Preview**: Quick-claim daily activities and login streaks.
- **Target Reward Unlock Showcase**: Progress toward next gadget reward.
- **Live Promotional Giveaways**: Real-time giveaway countdowns and entry system.
- **Level Journey Framework**: Multi-tier progression framework.
- **Achievement Wall**: Visual badges with milestone tracking.
- **Activity Log Timeline**: Real-time stream of earned and redeemed points.
- **Leaderboard Preview**: Masked podium showcase of top members.
- **FAQ & Interactive Guides**: Comprehensive questions and answers.

### 2. Rewards Store Catalog
- **Tech Items & Electronics**: iPhone 15 Pro, Samsung Galaxy S24 Ultra, Apple Watch Series 9, Wireless Earbuds, PS5.
- **Digital Gift Cards**: Amazon, Apple Store cards.
- **Server-Side Validation**: Never trusts points, prices, or user balances from the frontend.
- **Redemption Flow**: Deducts VE Points, checks inventory stock, updates order status, generates digital codes for gift cards, and records transaction logs.

### 3. Daily & Weekly Challenges
- **Activity Challenges**: Daily Login (+50 pts), Profile Verification (+100 pts), Refer a Friend (+250 pts), Daily Activity (+150 pts), Store Redemption (+300 pts).
- **Anti-Exploit Safeguards**: Server-side checks preventing double-claiming rewards with unique user challenge tracking.

### 4. Leaderboard
- **Rankings**: Top 50 members ranked by VE Points and level status.
- **Podium Showcase**: 🥇 1st Gold, 🥈 2nd Silver, 🥉 3rd Bronze podium cards.
- **Privacy Compliance**: Anonymizes member names (`AYU****92`) for identity protection.

### 5. Promotional Giveaways
- **Giveaway Cards & Countdowns**: Real-time countdown clock and prize details.
- **Prize Claiming**: Claim verification modal with digital/physical fulfillment tracking.
- **Winner Showcase**: Previous winner carousel displaying anonymized winner records.

### 6. Points Ledger & Transaction History
- **Immutable Ledger**: Detailed log of all earned, spent, daily bonus, challenge reward, achievement reward, and admin adjustment transactions.
- **Order Tracking**: Shipping status for physical rewards and view digital gift codes.

---

## 📂 3. Project Structure

```text
veloop-rewards/
│
├── package.json               # Root manifest with build script
├── vercel.json                # Vercel deployment & SPA routing rules
├── README.md                  # Project documentation
│
├── client/                    # React 18 + Vite Frontend Application
│   ├── src/
│   │   ├── components/        # Navbar, Footer, Modals, Giveaways
│   │   ├── pages/             # Dashboard, Store, Challenges, Leaderboard
│   │   ├── services/          # API services & Axios clients
│   │   ├── styles/            # Design system (Charcoal & Midnight palette)
│   │   └── App.jsx            # React Router SPA routes
│   ├── package.json
│   └── vite.config.js
│
├── frontend/                  # Synchronized 1:1 Frontend Mirror
│   ├── src/
│   └── package.json
│
└── server/                    # Node.js + Express Backend API
    ├── src/
    │   ├── config/            # DB & Environment variables
    │   ├── controllers/       # Auth, Rewards, Challenges, Giveaways
    │   ├── models/            # Mongoose schemas (User, Reward, etc.)
    │   ├── routes/            # REST API endpoints
    │   └── tests/             # Automated test suites
    └── package.json
```

---

## 🚀 4. Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/ayushsinghtiwari144-rgb/veloops_rewards.xml.git
cd veloops_rewards.xml
```

### 2. Install & Start Frontend
```bash
# From root:
npm install --prefix client
npm run build --prefix client

# Start development server:
cd client
npm run dev
```

### 3. Install & Start Backend
```bash
cd server
npm install
npm run dev
```

---

## 🔒 5. Security & Validation Architecture

1. **Password Security**: Passwords hashed with `bcryptjs` (salt rounds = 10).
2. **Stateless JWT**: Access tokens signed with `HS256`, 15m expiration, role payloads.
3. **Double-Claim Safeguards**: Enforced uniquely in database challenge tracking.
4. **Server-Side Balance Validation**: Order transactions verify points balance server-side.
5. **Privacy Protection**: Anonymizes public leaderboard identities (`AYU****92`).
6. **Rate Limiting & Helmet**: Prevents API abuse and sets secure HTTP headers.

---

## 👨‍💻 Developer & License

- **Developer**: Ayush Singh Tiwari (Full Stack Developer)
- **GitHub**: [ayushsinghtiwari144-rgb](https://github.com/ayushsinghtiwari144-rgb)
- **License**: Distributed under the MIT License.
