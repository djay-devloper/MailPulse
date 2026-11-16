# MailPulse – AI-Powered Executive Email Management Dashboard

> **Prototype for Executive Personal Assistants (EAs) & Busy Clients (Founders/Execs)**  
> Built with **React.js, Tailwind CSS, Lucide Icons, Node.js, Express.js, MongoDB/In-Memory Store**, and **Google Gemini 2.5 Flash (`@google/generative-ai`)**.

---

## 🌟 Executive Product Vision & Problem Solved
Executive Personal Assistants manage crowded, high-stakes mailboxes across multiple providers (Gmail & Microsoft Outlook). The primary challenge is determining **who is responsible for replying to each email** without cognitive triage fatigue:
- Does this require the **Founder/Client's personal legal or executive authority** (term sheets, board votes, cap table/equity, enterprise escalation)?
- Can the **Assistant directly handle it** (podcast scheduling, banquet riders, logistics, press coordination)?
- Is **no reply required** (Stripe billing statements, Delaware state tax receipts, airline itineraries)?
- Or does it **need human review** due to ambiguous intent (unusual GPU spend alerts, vague corporate M&A pitches)?

**MailPulse** solves this by providing:
1. **👩💼 Assistant Dashboard**: A command center featuring KPI overview metrics, upcoming deadlines/meetings, multi-segment filtering, confidence scores, manual classification overrides, and an AI Reply Composer.
2. **👔 Minimalistic Client View**: An ultra-clean, zero-noise executive view displaying **ONLY** emails that require the client's personal decision, complete with explicit **"Why Your Personal Response is Needed"** callouts and **1-click delegation**.

---

## 🚀 Live Servers & Access
The application is running live and ready for testing:
- **Unified Full-Stack App**: `http://localhost:5001`
- **Vite Frontend with HMR**: `http://localhost:3000`
- **API Health Check**: `http://localhost:5001/api/health`

---

## 🏗️ Technical Architecture & Data Model

### Backend
- **Node.js & Express.js** with RESTful endpoints (`/api/threads`, `/api/ai`, `/api/connections`).
- **Dual Store Architecture**: Supports **MongoDB/Mongoose** when `MONGODB_URI` is provided, with an automatic **in-memory fallback** seeded on startup so the app works immediately out of the box without any setup.
- **Google Gemini API (`@google/generative-ai`)**:
  - Model: `gemini-2.5-flash` for high-speed triage, date extraction, and draft reply generation.
  - **Heuristic AI Engine**: Built-in intelligent rule engine that gracefully handles triage, rationale generation, date extraction, and draft generation if no API key is configured or when offline.

### Frontend
- **React.js (Vite)** + **Tailwind CSS** + **Lucide Icons**.
- Linear and Superhuman-inspired dark/light obsidian styling: Inter typography, high-contrast badges, smooth slide-overs, and toast notifications.
- **3-Pane Desktop Layout & Responsive Mobile View**:
  - Pane 1: Segment & Responsibility Navigation.
  - Pane 2: Instant Search, Filter bar (Gmail/Outlook/All), and visual hierarchy Email Cards.
  - Pane 3: Thread History, AI Intelligence Card, Calendar Date Extractor, and AI Reply Composer.

---

## 📬 15 Pre-Seeded Realistic Executive Conversations

The app is pre-seeded with 15 rich, multi-message conversations across **Gmail (`alex@founder.vc`)** and **Outlook (`alex@enterprise.io`)**:

| # | Provider | Subject | Sender | Classification | Segment |
|---|---|---|---|---|---|
| 1 | **Gmail** | Series B Term Sheet Final Execution – Alex's Signature Needed | Sarah Jenkins (Horizon Cap) | `Client to Reply` | Action Required |
| 2 | **Outlook** | Podcast Recording Rescheduling: New Recording Windows | Tim Ferriss Show Production | `Assistant to Reply` | Meetings & Appointments |
| 3 | **Gmail** | Monthly Billing Statement & Receipt - Invoice #INV-2026-9812 ($24.8k) | Stripe Billing Notifications | `No Reply Needed` | General |
| 4 | **Outlook** | Confidential exploratory synergy discussion | Liam Vance (GlobalTech VP) | `Needs Review` | Important |
| 5 | **Gmail** | RE: Custom Enterprise Tier Quote & GPU Reservation (#Q-8821) | David Chen (CloudScale) | `Assistant to Reply` | Waiting for Response |
| 6 | **Outlook** | Urgent: Q4 Board Meeting Agenda & 2027 Budget Approval | Marcus Brody (Lead Director) | `Client to Reply` | Important |
| 7 | **Gmail** | Interview Request: Bloomberg profile on AI Executive Assistants | Clara Oswald (Bloomberg) | `Assistant to Reply` | Action Required |
| 8 | **Outlook** | ALERT: Unusual spend detected in us-east-1 (GPU +340%) | AWS CloudWatch Alert | `Needs Review` | Important |
| 9 | **Outlook** | Executive Leadership Retreat: Banquet Menu & AV Rider Agreement | Amanda Cross (Ritz-Carlton) | `Assistant to Reply` | Meetings & Appointments |
| 10 | **Gmail** | Offer Discussion & Equity Vesting Acceleration Terms | Dr. Aris Thorne (Chief AI Sci) | `Client to Reply` | Action Required |
| 11 | **Gmail** | eTicket Confirmation: SFO -> JFK (Flight UA 1408, First Class) | United Airlines Reservations | `No Reply Needed` | General |
| 12 | **Outlook** | Status Update: European IP Trademark Filing & WIPO Response | Samantha Vance (Cooley LLP) | `Assistant to Reply` | Waiting for Response |
| 13 | **Outlook** | Annual Franchise Tax Report Submission Confirmation #592180 | Delaware Division of Corps | `No Reply Needed` | General |
| 14 | **Gmail** | Critical: Annual Contract Renewal & Enterprise SLA Escalation | Robert Gallagher (FinSecure) | `Client to Reply` | Action Required |
| 15 | **Outlook** | Invitation: Opening Keynote on AI Autonomous Agents | Natasha Roy (TechSummit) | `Assistant to Reply` | Meetings & Appointments |

---

## ⚡ Key User Journeys & Features

### 1. Persistent Top Header & Role Switcher
- Smooth toggle: `[👩💼 Assistant Dashboard]` vs `[👔 Minimalistic Client View]`.
- Live connection pills: **Gmail** (`alex@founder.vc`) and **Outlook** (`alex@enterprise.io`) with real-time status pulses.
- Direct triggers for **Manage Connections**, **+ Simulate Incoming Email**, **Reset Seed**, and **Ask AI Copilot**.

### 2. Assistant Command Center
- **Overview KPI Bar**: Real-time counters for Total, Unread, Important, Action Required, Waiting for Response, Assigned to Assistant (Blue), Client Attention (Amber), and Handled.
- **Upcoming Dates Strip**: Extracted calendar meetings and deadlines with 1-click jump to conversation.
- **Left Sidebar**: Quick filtering across reply responsibility and smart segments.
- **Right Split-Pane**:
  - Full multi-message thread history.
  - **AI Intelligence Card**: AI summary, extracted dates with 1-click "Add to Calendar" feedback, and **Manual Responsibility Override Dropdown** (`Assistant to Reply`, `Client to Reply`, `No Reply Needed`, `Needs Review`) marking `manuallyOverridden: true`.
  - **Simulate Incoming Message in Thread**: Dynamically injects a reply and watches AI re-evaluate responsibility.
  - **AI Reply Composer**: Pre-populated AI drafts, 3-tone selector (`Professional`, `Concise`, `Warm`), and explicit **Approve & Send** button.

### 3. Minimalistic Client View
- Ultra-clean executive layout showing **ONLY** the 4 emails classified as `Client to Reply`.
- Subtle collapsible "Recently Handled by Assistant" peace-of-mind summary.
- Highlighted amber callout: **"Why Your Personal Authority is Needed"**.
- **1-Click Client Actions**:
  - **"Hand Over to Assistant" (Delegate)**: Add optional note -> Re-routes to assistant dashboard in real time.
  - **"Mark as Handled"**: Marks completed and removes from active queue.
  - **"Review & Send Quick Reply"**: Review and approve AI-generated draft in 1 click.

### 4. AI-Powered Email Assistant Copilot ("Ask AI About Inbox")
Slide-over drawer supporting continuous queries and 6 exact evaluation prompt chips:
1. *"Show me emails that need my attention."*
2. *"Summarize this conversation."*
3. *"What am I waiting for a response on?"*
4. *"Which emails require the client's attention?"*
5. *"Why has this email been assigned to the client?"*
6. *"Draft a reply to this conversation."*

### 5. Live AI Triage Simulator ("+ Simulate Incoming Email")
Modal supporting 3 pre-built scenarios or custom inputs:
- Computes live classification preview (Responsibility, Confidence, Segment, Summary, Rationale, Dates, Draft).
- "Inject into Inbox & Apply Triage" button places it directly into the active inbox.

---

## 🛠️ Environment Configuration & Scripts
- **Start Backend**: `npm run dev:server` (or `node server/src/index.js`)
- **Start Frontend**: `npm run dev:client` (or `cd client && npm run dev`)
- **Concurrent Run**: `npm run dev`
- **Optional Gemini API Key**: Set `GEMINI_API_KEY` in `server/.env` or enter it directly in the UI under **Manage Connections > Gemini AI Settings**.
# MailPulse
