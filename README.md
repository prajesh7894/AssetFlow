# AssetFlow ERP

AssetFlow is a next-generation Enterprise Asset Management System designed for the Odoo Hackathon. It bridges the gap between physical hardware and digital workflows, featuring Kanban boards, live mathematical timeline rendering, dual-view personnel directories, and a robust physical barcode scanner simulator.

## 📚 Hackathon Documentation

For judges and reviewers, please refer to the professional documentation located in our `docs/` folder:

- [🚀 Hackathon Presentation Pitch](./docs/HACKATHON_PRESENTATION.md)
- [🧑‍⚖️ Judge Q&A Cheat Sheet](./docs/JUDGE_QA.md)
- [🌟 Executive Project Summary](./docs/PROJECT_SUMMARY.md)
- [🏗️ System Architecture & Diagrams](./docs/SYSTEM_ARCHITECTURE.md)

## Features

1. **Dashboard & KPIs**: Real-time analytical dashboard with beautiful Recharts data visualization.
2. **Asset Management**: Full CRUD for laptops, furniture, and software licenses with built-in status tagging.
3. **Chain of Custody (Allocation)**: Transfer hardware between users, featuring Split-View tracking for active and in-transit assets.
4. **Timeline Bookings**: Mathematical time-grid rendering for booking meeting rooms, projectors, and vehicles with exact overlap validation.
5. **Maintenance Kanban**: Drag-and-drop workflow simulation with visual status states and a historical resolution timeline.
6. **Audit & Hardware Verification**: Simulates a physical RFID/Barcode scanner. Automatically verifies physical locations against database expectations, instantly flagging Missing or Mismatched assets.
7. **Organization Setup**: Dual-view module mapping Employees directly to their Departments and calculating assigned hardware on the fly.
8. **Reports Engine**: Cross-collection calculations for Audit Compliance Rates, Maintenance Loads, and a universal client-side CSV Export Engine.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Firebase Firestore (Production) + LocalStorage Sandbox Sandbox (Demo Mode)
- **Routing**: React Router DOM (v6)
- **Data Fetching**: Custom intelligent React Hooks
- **Forms**: React Hook Form + Zod
- **Visuals**: Recharts, Lucide React
- **Notifications**: Sonner

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Rename `.env.example` to `.env` and fill in your Firebase configuration keys.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Demo Mode (Sandbox)
If you do not provide Firebase keys, the application will automatically enter **Demo Mode**. 
Simply log in with `admin@assetflow.com` (password: `admin123`) and click **Seed Sandbox Data** on the dashboard to populate the local database and explore the features!

## Deployment

This app is optimized for Vercel.

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the terminal to deploy.
3. To deploy to production, run `vercel --prod`.
