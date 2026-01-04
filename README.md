# 🩸 BloodBridge - Intelligent Blood & Emergency Network

BloodBridge is a next-gen, division-aware lifesaving platform that unifies donors, recipients, ambulances, clinics, hematology experts, NGOs, and health intelligence into a single experience. Built with React, Vite, Express, MongoDB, and Firebase Auth – now enhanced with AI-assisted donor matching, live donor maps, urgency-aware workflows, QR verification, and proactive wellness tooling.

---

## ✅ Core Feature Matrix

| # | Feature | Implementation Highlights |
|---|---------|---------------------------|
| 1 | **Donor Registration & Management** | Availability toggles, geo-aware addresses, last donation logging, built-in health self-assessment, reminder preferences, QR identity |
| 2 | **Emergency Blood Requests** | Recipient urgency form (Critical/Urgent/Flexible), hospital metadata, location tagging, AI donor matcher, auto-suggested ambulances |
| 3 | **Search & Filter Donors** | Public donor explorer with blood group + division filters, availability badges, donation streaks, verified history, badge showcase |
| 4 | **Admin Panel** | Full user/request/eligibility management, health compliance flags, donation vs. request stats, blog/content controls |
| 5 | **Emergency Ambulance Service 🚑** | Division-wise verified contacts, GPS-powered nearest ambulance detection, SOS trigger, service status badges |
| 6 | **Division-wise Best Clinics 🏥** | Curated hematology clinic grid with ratings, facilities, 24/7 hotline info, deep links to requests & ambulances |
| 7 | **Live Donor Map (Advanced)** | Leaflet-powered interactive map, blood-group filters, urgency overlay, live status pulses, hover cards |
| 8 | **Blood Health & Information 🧪** | Serum creatinine / Hb / platelet / RBC / WBC ranges, interactive charts (Recharts), alert thresholds, educational cards & blog feed |
| 9 | **Hematology Doctor Suggestions 👨‍⚕️** | Division directory with specialties, credentials, contact info, quick request integration |
|10 | **Blood Bank & NGO Directory 📞** | Division filters, verified phone/email, copy-to-clipboard, contextual tips |
|11 | **Urgency-Based Prioritization** | Critical/Urgent/Flexible labels, SLA timers, donor nudges ordered by urgency |
|12 | **Chatbot Assistant (Bolt-style)** | 24/7 guided assistant with richer knowledge base, FAQs, eligibility coach, quick prompts |
|13 | **Donor Rewards & Badges** | Bronze/Silver/Gold milestones, certificate download stub, dashboard streak tracker, sharing links |
|14 | **Automated Donation Reminders** | 90-day auto-reminder preference capture (email/SMS/push), local scheduling preview |
|15 | **QR-Based Verification** | Unique QR for each donor/request, scannable verifications on request detail + dashboard |

> Every feature above is wired into the UI today, with fallbacks for offline/seed data to keep the experience smooth in development.

---

## 🔐 Demo Admin Access

- 👤 **Email:** admin@bloodbridge.com  
- 🔑 **Password:** 123456  
*(Use the seeded admin account to explore moderation, eligibility toggles, and stats.)*

---

## 🧭 Experience Overview

### Public Experience
- Animated hero with live stats + emergency CTA
- AI-powered donor search & urgency feed
- Ambulance + clinic + NGO directories per division
- Health intelligence lab with live charts
- Blog/education cards & chatbot concierge

### Authenticated Dashboards
- **Donor:** profile wellness checks, badge streaks, reminder toggles, QR identity, latest requests, AI suggestions
- **Volunteer:** request triage view, donor engagement snapshot, health compliance cues
- **Admin:** user lifecycle management, urgency distribution charts, blog/content workflows, division heatmaps

---

## 🛠️ Tech Stack

### Frontend
- React 19, React Router 7
- Vite + Tailwind CSS v4 (@tailwindcss/vite)
- Recharts, React-Leaflet + Leaflet
- Lottie, SweetAlert2, React Icons, React Helmet Async

### Backend
- Node.js + Express
- MongoDB (Atlas) with donor/request/blog collections
- Firebase Admin for token verification + role guard

---

## 📁 Project Structure (Client)

```
src/
├── assets/            # Lottie animations & media
├── components/        # Global + feature sections
├── data/              # Division directories, health ranges
├── hooks/             # Axios helpers, auth hooks
├── layouts/           # Root + dashboard shells
├── pages/             # Route-level screens
├── providers/         # Auth provider
└── Routers/           # Route definitions + guards
```

---

## 🚀 Getting Started

1. **Install**
   ```bash
   cd BloodBridge_Client
   npm install
   ```
2. **Configure Firebase + API**
   ```
   VITE_apiKey=...
   VITE_backend_url=http://localhost:5173
   ```
3. **Run**
   ```bash
   npm run dev
   ```
4. **Server**
   ```bash
   cd ../BloodBridge_Server
   npm install && node index.js
   ```

---

## 🎯 Roles & Permissions

- **Donor:** manage profile, availability, reminders, QR badge, create & monitor requests
- **Volunteer:** donor search, request triage, ambulance/clinic linking
- **Admin:** full CRUD on users/requests/blogs, role/status, eligibility overrides, analytics

---

## 📊 Collections (MongoDB)

### users
`name, email, image, role, status, bloodGroup, district, upazila, availabilityStatus, lastDonationDate, geo, healthAssessment, reminderPreferences, badges`

### donationRequest
`requester info, recipient info, hospital metadata, urgencyLevel, location, aiRecommendations, needsAmbulance, status timeline, qrId`

### donorInfo
`donationId, donorEmail, donorName, confirmedAt`

### blogs
`title, content, thumbnail, author, status`

---

## 🎨 Visual Direction

- Glassmorphism + gradient glow across components
- Accessibility-first color palette (Rose/Red with neutral grays)
- Micro-animations for cards, SOS buttons, map markers, and urgency chips

---

## 📞 Contact

**Developer:** Md Forhad Hasan & Muhammad Milon Mia  
**Email:** forhadhasan1007@gmail.com & mmilon82814@gmail.com 

---

**Crafted with ❤️ — BloodBridge connects donors, doctors, ambulances, and hope.**
