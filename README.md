# VELOOP Rewards — Premium Full-Stack Giveaway Platform

![Deployment](https://img.shields.io/badge/Vercel-Live%20Public%20App-000000?style=for-the-badge&logo=vercel)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Express%20%7C%20MongoDB-green?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-JWT%20%7C%20Bcrypt%20%7C%20Fraud%20Engine%20%7C%20Rate%20Limit-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 1. Project Overview

**VELOOP Rewards** is a production-ready, full-stack promotional rewards and giveaway platform. Designed with enterprise-grade security, transaction integrity, and modern user experience in mind, VELOOP Rewards allows verified users to explore promotional campaigns, review verified prize specifications, participate using platform rewards currency, view provably fair winner announcements, and submit secure prize claims.

The platform is built on a clear separation of concerns:
- **React + Vite Frontend**: Responsive, accessible, and fast presentation layer.
- **Node.js + Express Backend**: The central authority enforcing user identity, campaign rules, currency deduction, fraud prevention, rate limiting, and winner drawing.
- **MongoDB + Mongoose Database**: The authoritative database of record, enforcing compound unique constraints and transactional consistency.

---

## 2. Giveaway Concept

VELOOP Rewards operates a promotional reward event cycle:
1. **Discovery**: Users browse promotional campaigns showcasing high-value physical goods (e.g. Apple iPhone 15 Pro, Sony PlayStation 5) or digital vouchers.
2. **Prize Specifications**: Detailed breakdowns of prize items, eligibility criteria, official terms, and countdown timers.
3. **Entry Requirements**: Backend-controlled entry costs using VELOOP Points currency.
4. **Participation**: Authenticated users submit participation requests. The backend validates eligibility, checks balances, assesses fraud risk, and executes an atomic transaction.
5. **Winner Selection**: Once a campaign reaches its scheduled end date, backend-controlled server randomness selects winners.
6. **Prize Claiming**: Confirmed winners submit physical shipping or digital delivery information through a secure, encrypted claim workflow.

---

## 3. Features Implemented

### Frontend (React.js + Vite + Bootstrap)
- **Responsive Homepage**: Hero showcase, live platform statistics, featured campaigns grid, process breakdown, winner feed ticker, trust indicators, rule accordion, FAQ, and call-to-action sections.
- **Giveaway Details View**: Deep-dive page with prize specs, terms accordion, live countdown timer, entry pricing, real-time participation status check, join trigger, and winner claim modal.
- **Winner Transparency Hub**: Dual-tab hub displaying live active campaign notices and verified historical winner records with privacy-masked identities.
- **Member Account Management**: Profile page rendering user credentials, account status, role, and real-time VELOOP Points balance.
- **Modal System**: Dynamic prize claim modal for physical shipping address or digital gift card email collection.
- **Custom Loader & Skeletons**: Interactive animated loader with rotating system status messages, alongside CSS skeleton placeholder UI loaders.

### Backend (Node.js + Express.js + MongoDB)
- **JWT Authentication & Passwords**: Bcrypt password hashing (10 salt rounds) and short-lived JWT Access Tokens with server-side database verification.
- **Role-Based Authorization**: Middleware restricting sensitive operations (such as winner drawing, audit log inspection, and fraud event queries) to `ADMIN` accounts.
- **Atomic MongoDB Transactions**: Session-managed multi-document transactions ensuring balance deduction, entry transaction creation, participation creation, and audit logging execute atomically or roll back completely.
- **Idempotency & Duplicate Protection**: Client request IDs (`requestId`) and database-level compound unique constraints (`userId + giveawayId`) prevent duplicate billing or entries.
- **Fraud Engine & Risk Scoring**: Real-time evaluation of device hashes, entry frequency, and account status, producing risk scores (LOW: 0–29, MEDIUM: 30–59, HIGH: 60–79, CRITICAL: 80–100).
- **Multi-Tier Rate Limiting**: `express-rate-limit` protecting general API, authentication endpoints, join requests, and claim submissions (`429 Too Many Requests`).
- **Cryptographic Winner Selection**: Backend-controlled `crypto.randomInt` winner selection executed only after campaign end date.
- **Privacy & Security Masking**: User identifiers masked publicly (`AYU****61`), and sensitive claim contact data set to `select: false` in Mongoose.

---

## 4. Giveaway States

VELOOP Rewards enforces three strict campaign lifecycle states:

| State | User Actions Allowed | Backend Rules Enforced |
| :--- | :--- | :--- |
| **`ACTIVE`** | View details, check status, join giveaway using VELOOP Points. | Accepts join requests if user is eligible, unblocked, and has sufficient balance. Rejects winner selection attempts. |
| **`UPCOMING`** | View details, countdown timer, pre-register rules. | Rejects join attempts with `GIVEAWAY_NOT_ACTIVE` error code. |
| **`ENDED`** | View winners, submit prize claim (if authenticated winner). | Rejects join attempts. Enables winner drawing by ADMIN. Enables claim submission for verified winners. |

---

## 5. User Journey Flow

```
User Registration / Login
       │
       ▼
Browse Active Giveaways Grid
       │
       ▼
Open Giveaway Details & Review Rules
       │
       ▼
Check Real-Time Participation Status
       │
       ▼
Click "Join Giveaway Now"
       │
       ▼
[Backend Authority Checks]
├── 1. JWT & Account Status Check
├── 2. Eligibility & Campaign Active Check
├── 3. Duplicate Entry Check (userId + giveawayId)
├── 4. Fraud Risk Assessment (Device / Frequency)
└── 5. Balance Verification (pointsBalance >= entryAmount)
       │
       ▼
[Atomic MongoDB Session Transaction]
├── Deduct VELOOP Points Balance
├── Create GiveawayEntryTransaction Record
├── Create GiveawayParticipation Record
└── Record AuditLog Entry
       │
       ▼
Return Success Response & Update Frontend UI
       │
       ▼
Giveaway Reaches End Date (Status: ENDED)
       │
       ▼
Backend Cryptographic Winner Selection (crypto.randomInt)
       │
       ▼
Public Winner Announcement (User ID Masked: AYU****61)
       │
       ▼
Winner Submits Prize Claim (Physical Address / Digital Email)
```

---

## 6. Security Architecture

```
Client Request
      │
      ▼
Helmet Security Headers & CORS (Restricted to CLIENT_URL)
      │
      ▼
Express Rate Limiter (IP Rate Limits: 429 Too Many Requests)
      │
      ▼
Body Parser Limits (10kb payload limit)
      │
      ▼
JWT Authentication Middleware (Bearer token + DB user lookup)
      │
      ▼
Role Authorization Middleware (ADMIN vs USER)
      │
      ▼
Input Validation & Sanitization (Strips client-supplied balance/userId overrides)
      │
      ▼
Fraud Engine (Risk Scoring & FraudEvent Logging)
      │
      ▼
Giveaway Service (Eligibility & Status Validation)
      │
      ▼
Atomic MongoDB Transaction (Balance Deduction + Participation Creation)
      │
      ▼
Audit Log Record
```

---

## 7. Tech Stack

### Frontend
- **React.js (v18)**: Component-driven user interface.
- **Vite (v5)**: High-performance frontend build tool.
- **Bootstrap (v5)**: Responsive grid, utility classes, and modal styling.
- **CSS Modules (`.module.css`)**: Encapsulated component styling.
- **React Router (v6)**: Declarative client-side routing.
- **Lucide React**: Modern icon vector set.

### Backend
- **Node.js (v20+)**: Event-driven JavaScript runtime environment.
- **Express.js (v4)**: Web application framework.
- **MongoDB & Mongoose (v8)**: Document database and Object Data Modeling (ODM).

### Security & Utilities
- **Bcrypt.js**: Password hashing (10 salt rounds).
- **JSONWebToken (JWT)**: Secure Bearer access token signing and verification.
- **Helmet**: HTTP security header hardening.
- **CORS**: Cross-Origin Resource Sharing control.
- **Express-Rate-Limit**: Route rate limiting.

---

## 8. Project Structure

```
veloop-rewards/
├── client/                          # React Frontend Application
│   ├── public/                      # Static assets & favicon
│   ├── src/
│   │   ├── assets/                  # Styling & static assets
│   │   ├── components/              # Modular UI components
│   │   │   ├── common/              # Button, Card, FAQ, Modal, PrizeImage, TrustSection
│   │   │   ├── giveaway/            # Countdown, GiveawayCard, GiveawayRules, GiveawayStats, HowToParticipate
│   │   │   ├── layout/              # Navbar, Footer, HeroSection
│   │   │   ├── loader/              # VeloopLoader, PrizeSkeleton, Spinner, WinnerSkeleton
│   │   │   └── winner/              # PrizeClaimModal, PreviousWinnerCard, WinnerCard, WinnerSlider
│   │   ├── context/                 # AuthContext (User session state management)
│   │   ├── pages/                   # Home, GiveawayDetails, Winners, Login, Register, Account, NotFound
│   │   ├── services/                # api.js, authService.js, giveawayService.js
│   │   ├── App.jsx                  # Main application routes
│   │   └── main.jsx                 # Entrypoint
│   ├── .env                         # Local frontend environment variables
│   ├── .env.example                 # Frontend environment template
│   ├── vercel.json                  # Single-Page Application (SPA) rewrite rules
│   ├── package.json                 # Frontend dependencies & scripts
│   └── vite.config.js               # Vite build configuration
│
├── server/                          # Express Backend API
│   ├── src/
│   │   ├── config/                  # db.js (MongoDB connection), env.js (Environment variables)
│   │   ├── controllers/             # authController, giveawayController, healthController
│   │   ├── middleware/              # authMiddleware, authorizationMiddleware, authValidationMiddleware,
│   │   │                            # errorMiddleware, fraudMiddleware, rateLimitMiddleware,
│   │   │                            # requestIdMiddleware, validationMiddleware
│   │   ├── models/                  # User, Giveaway, Prize, GiveawayPrize, GiveawayParticipation,
│   │   │                            # GiveawayEntryTransaction, GiveawayWinner, PrizeClaim, FraudEvent, AuditLog
│   │   ├── routes/                  # authRoutes, giveawayRoutes, adminRoutes, healthRoutes, index.js
│   │   ├── services/                # auditService, authService, balanceService, claimService,
│   │   │                            # eligibilityService, fraudService, giveawayParticipationService,
│   │   │                            # giveawayService, winnerService
│   │   ├── tests/                   # phase9Tests.js (Automated backend security & logic test suite)
│   │   ├── utils/                   # apiResponse.js, deviceHash.js, logger.js, maskUtils.js, seedData.js, tokenUtils.js
│   │   └── server.js                # Express entrypoint
│   ├── .env                         # Local backend environment variables
│   ├── .env.example                 # Backend environment template
│   └── package.json                 # Backend dependencies & scripts
│
├── .gitignore                       # Git ignore rules for node_modules, .env, build outputs
└── README.md                        # Project documentation
```

---

## 9. Component Architecture

| Component | Description |
| :--- | :--- |
| `HeroSection` | Hero section featuring promotional messaging and primary action triggers. |
| `GiveawayStats` | Platform performance counter showcasing total entries and prize statistics. |
| `GiveawayCard` | Campaign preview card rendering prize image, badge state, timer, entry cost, and action button. |
| `GiveawayRules` | Accordion rendering eligibility requirements, platform guidelines, and legal terms. |
| `Countdown` | Real-time countdown timer formatting remaining days, hours, minutes, and seconds. |
| `WinnerSlider` | Animated infinite ticker displaying recent verified winners with masked user IDs. |
| `PrizeClaimModal` | Form modal for verified winners to submit physical shipping address or digital email. |
| `VeloopLoader` | Custom full-page or section loader displaying rotating system status messages. |
| `PrizeSkeleton` | Animated CSS glow placeholder skeleton displayed during API data fetching. |

---

## 10. Database Models

The MongoDB database consists of 10 Mongoose schemas:

1. **`User`**: Account identity, hashed credentials (`passwordHash` with `select: false`), role (`USER`, `ADMIN`), account status (`ACTIVE`, `BLOCKED`), and `pointsBalance`.
2. **`Giveaway`**: Campaign entity storing `title`, `slug`, `status` (`ACTIVE`, `UPCOMING`, `ENDED`), entry costs, currency, and participant counters.
3. **`Prize`**: Prize item definition storing `name`, `image`, `prizeType` (`PHYSICAL`, `GIFT_CARD`, `DIGITAL`), and monetary value.
4. **`GiveawayPrize`**: Junction mapping giveaways to associated prizes and positions.
5. **`GiveawayParticipation`**: Unique entry record for a user in a giveaway (`{ userId: 1, giveawayId: 1 }` unique index).
6. **`GiveawayEntryTransaction`**: Financial audit ledger of points deductions and idempotency request IDs (`requestId`).
7. **`GiveawayWinner`**: Record of selected winners (`{ giveawayId: 1, userId: 1 }` unique index) and selection method.
8. **`PrizeClaim`**: Shipping or email claim submission for winners (`{ winnerId: 1 }` unique index). Sensitive fields set to `select: false`.
9. **`FraudEvent`**: Risk monitoring log capturing suspicious request patterns, device hashes, and calculated risk scores.
10. **`AuditLog`**: System audit log recording security actions, joins, claims, and admin drawings.

---

## 11. API Documentation

### System Health
```http
GET /api/health
```
- **Auth**: None
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "VELOOP Rewards API is fully operational",
  "database": "connected",
  "timestamp": "2026-09-26T12:00:00.000Z"
}
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```
- **Auth**: None (Rate limited: 15 attempts / 15 mins)
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f8a123bc45678901234567",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER",
      "pointsBalance": 500
    },
    "accessToken": "eyJhbGciOiJIUzI1Ni..."
  }
}
```

#### Login User
```http
POST /api/auth/login
```
- **Auth**: None (Rate limited: 15 attempts / 15 mins)
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```
- **Response (200 OK)**: Returns `user` object and Bearer `accessToken`.

#### Get Current User
```http
GET /api/auth/me
```
- **Auth**: Required (`Authorization: Bearer <token>`)
- **Response (200 OK)**: Returns authenticated user profile and live `pointsBalance`.

#### Logout User
```http
POST /api/auth/logout
```
- **Auth**: None
- **Response (200 OK)**: `{ "success": true, "message": "Logged out successfully" }`

---

### Giveaway Endpoints

#### Fetch Active Giveaways
```http
GET /api/giveaways/current
```
- **Auth**: None
- **Response (200 OK)**: Returns array of active campaign objects.

#### Fetch Giveaway by ID or Slug
```http
GET /api/giveaways/:id
```
- **Auth**: None
- **Parameters**: `id` (ObjectId or slug string e.g. `iphone-15-pro`)
- **Response (200 OK)**: Returns campaign details object.

#### Fetch My Participation Status
```http
GET /api/giveaways/:id/my-status
```
- **Auth**: Required (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "participated": true,
    "status": "ACTIVE",
    "joinedAt": "2026-09-26T10:15:30.000Z"
  }
}
```

#### Join Giveaway (Real Transaction Flow)
```http
POST /api/giveaways/:id/join
```
- **Auth**: Required (`Authorization: Bearer <token>`, Rate limited: 5 attempts / min)
- **Request Body**:
```json
{
  "requestId": "req_1711450000_abc123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Successfully joined giveaway",
  "data": {
    "participationId": "65f8c999bc45678901234567",
    "status": "ACTIVE",
    "joinedAt": "2026-09-26T10:15:30.000Z"
  }
}
```

#### Fetch Public Giveaway Winners
```http
GET /api/giveaways/:id/winners
```
- **Auth**: None
- **Response (200 OK)**: Returns array of winner objects with masked identity (`maskedUserId: "JOH****59"`).

#### Fetch Previous Historical Winners
```http
GET /api/giveaways/previous/winners
```
- **Auth**: None
- **Response (200 OK)**: Returns list of historic winners across concluded events.

---

### Prize Claim Endpoints

#### Submit Prize Claim
```http
POST /api/giveaways/:id/claim
```
- **Auth**: Required (Must be verified winner of the giveaway)
- **Request Body (Physical Prize)**:
```json
{
  "name": "Jane Doe",
  "phone": "+15551234567",
  "address": "123 Main Street, Apt 4B",
  "city": "New York",
  "state": "NY",
  "pinCode": "10001"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Prize claim submitted successfully",
  "data": {
    "claimId": "65f8d111bc45678901234567",
    "claimStatus": "SUBMITTED",
    "submittedAt": "2026-09-26T11:00:00.000Z"
  }
}
```

#### Fetch My Claim Status
```http
GET /api/giveaways/:id/my-claim
```
- **Auth**: Required (`Authorization: Bearer <token>`)
- **Response (200 OK)**: Returns user claim status (`claimed: true`, `claimStatus: "SUBMITTED"`).

---

### Admin Endpoints

#### Select Winners for Giveaway
```http
POST /api/admin/giveaways/:id/select-winners
```
- **Auth**: Required (`ADMIN` role required)
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Winner selection completed successfully",
  "data": {
    "winnerCount": 1,
    "winners": [
      {
        "id": "65f8e222bc45678901234567",
        "userId": "65f8a123bc45678901234567",
        "status": "SELECTED"
      }
    ]
  }
}
```

---

## 12. API Error Codes

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `GIVEAWAY_NOT_FOUND` | 404 | The requested giveaway slug or ID does not exist. |
| `GIVEAWAY_NOT_ACTIVE` | 400 | Attempted to join a giveaway that is UPCOMING or ENDED. |
| `GIVEAWAY_NOT_ENDED` | 400 | Attempted to draw winners or submit claims before giveaway end date. |
| `ALREADY_PARTICIPATING` | 400 | User has already joined this giveaway (caught via DB unique index). |
| `INSUFFICIENT_VE_BALANCE` | 400 | User balance is lower than the required campaign entry cost. |
| `LOGIN_REQUIRED` | 401 | Missing or unauthenticated Authorization Bearer header. |
| `TOKEN_EXPIRED` | 401 | Authentication JWT token has expired. |
| `TOKEN_INVALID` | 401 | Authentication JWT token failed signature verification. |
| `FORBIDDEN` | 403 | User lacks required role permissions (e.g. non-ADMIN requesting admin routes). |
| `ACCOUNT_BLOCKED` | 403 | User account has been suspended by administration. |
| `CLAIM_NOT_ALLOWED` | 403 | Authenticated user is not the recorded winner for this giveaway. |
| `CLAIM_ALREADY_SUBMITTED` | 400 | Prize claim has already been submitted for this giveaway. |
| `WINNERS_ALREADY_SELECTED` | 400 | Winners have already been selected for this campaign. |
| `RATE_LIMITED` | 429 | IP address exceeded request frequency limit. |
| `DATABASE_UNAVAILABLE` | 503 | Database service is disconnected or unreachable. |

---

## 13. Installation & Local Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas URI.

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/veloop-rewards.git
cd veloop-rewards
```

### 2. Configure Environment Files

#### Backend Environment (`server/.env`)
Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/veloop_rewards
JWT_SECRET=development_jwt_secret_key_12345
REFRESH_SECRET=development_refresh_secret_key_12345
CLIENT_URL=http://localhost:5173
```

#### Frontend Environment (`client/.env`)
Create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Install Dependencies & Seed Database

```bash
# Install Server Dependencies
cd server
npm install

# Seed Sample Giveaways & Users
npm run seed

# Install Client Dependencies
cd ../client
npm install
```

### 4. Run Application Locally

```bash
# Start Backend Server (Terminal 1)
cd server
npm start

# Start Frontend Dev Server (Terminal 2)
cd client
npm run dev
```

- **Frontend URL**: `http://localhost:5173`
- **Backend API URL**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

#### Test User Credentials (from Seeder)
- **Normal User**: `user@veloop.com` / `password123`
- **Admin User**: `admin@veloop.com` / `admin123`

---

## 14. Loading, Error & Empty States

The frontend provides explicit UX feedback states for all async network conditions:
- **Loading Messages**: Rotating status messages in `VeloopLoader`:
  - *"Preparing today's rewards…"*
  - *"Checking active giveaways…"*
  - *"Bringing your rewards closer…"*
  - *"Joining Giveaway..."*
- **Skeleton Placeholders**: Animated CSS skeleton loader (`PrizeSkeleton`, `WinnerSkeleton`) shown while campaigns load.
- **Empty States**:
  - Home: *"No active giveaways right now."*
  - Winners Hub: *"No active giveaways at this moment."* / *"No previous winners yet."*
- **Error Banners & Retries**: Red error alerts with retry triggers if the backend API is temporarily unreachable.

---

## 15. Responsive & Accessibility Design

- **Tested Viewports**: 320px (Mobile S), 375px (Mobile M), 414px (Mobile L), 768px (Tablet), 1024px (Laptop), 1440px (Desktop), 1920px (Widescreen).
- **Flex & Grid Layouts**: Responsive Bootstrap 5 grid preventing horizontal scrolling or text overflow.
- **Accessibility**:
  - Semantic HTML landmarks (`<main>`, `<header>`, `<footer>`, `<section>`).
  - High-contrast color palette meeting WCAG AA standards.
  - Visible focus indicators for keyboard navigation.
  - Interactive ARIA states on modal popups and accordions.

---

## 16. Production Deployment Guide

### Frontend Deployment (Vercel)
1. Import `veloop-rewards/client` into Vercel.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Set Environment Variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
5. Note: `vercel.json` in `client/` handles single-page app route rewrites to prevent 404s on page refresh.

### Backend Deployment (Render / Railway)
1. Deploy `veloop-rewards/server` to Render or Railway as a Web Service.
2. Set Environment Variables:
   - `PORT=5000`
   - `MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/veloop_rewards`
   - `JWT_SECRET=<strong_random_secret>`
   - `REFRESH_SECRET=<strong_random_secret>`
   - `CLIENT_URL=https://your-frontend.vercel.app`
3. Start Command: `node src/server.js`

---

## 17. License

Distributed under the MIT License. See `LICENSE` for more information.
